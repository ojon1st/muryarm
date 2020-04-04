const path = require('path');
const mongoose = require('mongoose');
const Article = require(path.join(__dirname, '/../models/Article'));
const Commentaire = require(path.join(__dirname, '/../models/Commentaire'));
const Config = require(path.join(__dirname, '/../configs/config'));


module.exports.populate = (router) => {


    router.post('/addArticle', function(req, res) {
        try {
            if(req.body.date && req.body.contenu && req.body.auteur) {
                let article = new article(req.body);
                await article.save();
                return res.json({
                    success: true,
                    data: article.toObject()
                });
            } else {
                return res.json({
                    success: false,
                    moreInfos: "Certaines informations capitales sont manquantes !"
                });
            }
        } catch(err) {
            console.log(err, err.stack);
            return res.json({
                success: false,
                moreInfos: "Une erreur interne est survenue, merci de réessayer plus tard."
            })
        }
    });

    router.post('/removeArticle/:article', function(req, res) {
        try {
            await Article.updateOne({
                _id: req.params.article
            }, {
                is_deleted: true
            });
            return res.json({
                success: true,
                moreInfos: "Article supprimé avec succès"
            })
        } catch(err) {
            console.log(err, err.stack);
            return res.json({
                success: false,
                moreInfos: "Une erreur est survenue lors de la suppression de l'article"
            });
        }
    });


    router.post('/listArticles', function(req, res) {
        try {
            let {_id} = req.body;
            let articles = Article.find({etat: Config.DELETED, _id: {
                $not: {
                    $in: req.body
                }
            }}).populate({
                path: 'auteur',
                select: 'username'
            });
            for(let article of articles) {
                article = article.toObject();
                article.nbreCommentaires = article.commentaires.length;
                article.liked = article.likes.includes(_id);
                delete article.likes;
                delete article.commentaires;
            }
            return res.json({
                success: true,
                data: articles
            });
        } catch(err) {
            console.log(err, err.stack);
            return res.json({
                success: false,
                moreInfos: "Une erreur interne est survenue, merci de réessayer plus tard."
            });
        }
    });

    router.post('/articleDetails/:article', function(req, res) {
        try {
            let article = Article.findById(req.params.article).populate({
                path: 'commentaires'
            });
            if (!article || (article.etat == Config.DELETED)) {
                throw new Error('Article supprimé !');
            }
            article = article.toObject();
            article.liked = article.likes.includes(req.body._id);
            delete article.likes;
            return res.json({
                success: true,
                data: article
            });
        } catch(err) {
            console.log(err, err.stack);
            return res.json({
                success: false,
                moreInfos: "Une erreur interne est survenue, merci de réessayer plus tard."
            });
        }
    });
    

    router.post('/toggleLikeArticle/:article', function(req, res) {
        try {
            let article = Article.findById(req.params.article);
            if (!article || (article.etat == Config.DELETED)) {
                throw new Error('Article supprimé !');
            }
            let {_id} = req.body, index = false;
            if(!~(index = article.likes.indexOf(_id))) {
                article.likes.addToSet(_id);
            } else {
                article.likes.splice(index, 1);
            }
            await article.save();
            return res.json({
                success: true,
                liked: !~index
            });
        } catch(err) {
            console.log(err, err.stack);
            return res.json({
                success: false,
                moreInfos: "Une erreur interne est survenue, veuillez réessayer plus tard."
            });
        }
    });

    router.post('/postComment/:article', function(req, res) {
        let session;
        try {
            if (req.body.auteur && req.body.contenu && req.body.date) {
                let commentaire = new Commentaire(req.body);
                session = await mongoose.startSession();
                session.startTransaction();
                let [,article] = await Promise.all([commentaire.save({session}), Article.findById(req.params.article).session(session)]);
                if (!article || (article.etat == Config.DELETED)) {
                    throw new Error('Article supprimé !');
                }
                article.commentaires.push(commentaire._id.toString());
                await article.save();
                await session.commitTransaction();
                session.endSession();
                return res.json({
                    success: false,
                    data: commentaire.toObject()
                });
            } else {
                return res.json({
                    success: false,
                    moreInfos: "Certaines informations capitales sont manquantes !"
                });
            }
        } catch(err) {
            console.log(err, err.stack);
            if(session) {
                await session.abortTransaction();
                session.endSession();
            }
            return res.json({
                success: false,
                moreInfos: "Une erreur est survenue, merci de réessayer plus tard."
            });
        }
    });
    
}