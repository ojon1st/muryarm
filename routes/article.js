const path = require('path');
const mongoose = require('mongoose');

const Article = require(path.join(__dirname, '/../models/Article'));
const Commentaire = require(path.join(__dirname, '/../models/Commentaire'));
const Config = require(path.join(__dirname, '/../configs/config'));


module.exports.populate = (router) => {


    router.post('/addArticle', async function(req, res) {
        try {
            if(req.body.date && req.body.contenu && req.body.auteur) {
                let article = new Article(req.body);
                await article.save();
                article = article.toObject();
                delete article.auteur;
                article.liked = false;
                article.likes = article.likes.length;
                article.nbreCommentaires = 0;
                delete article.commentaires;
                return res.json({
                    success: true,
                    data: article
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
            });
        }
    });

    router.post('/removeArticle/:article', async function(req, res) {
        try {
            await Article.updateOne({
                _id: req.params.article
            }, {
                etat: Config.DELETED
            });
            return res.json({
                success: true,
                moreInfos: "Article supprimé avec succès"
            });
        } catch(err) {
            console.log(err, err.stack);
            return res.json({
                success: false,
                moreInfos: "Une erreur est survenue lors de la suppression de l'article"
            });
        }
    });


    router.post('/listArticles', async function(req, res) {
        try {
            let {_id} = req.body;
            let articles = await Article.find({
                etat: {
                    $ne: Config.DELETED
                }, 
                _id: {
                    $not: {
                        $in: req.body
                    }
                }
            }).populate({
                path: 'auteur',
                select: '-_id username'
            })
            .populate({
                path: 'commentaires'
            });
            let data = []
            for(let article of articles) {
                article = article.toObject();
                article.nbreCommentaires = article.commentaires.filter(({etat}) => etat != Config.DELETED).length;
                article.liked = article.likes.includes(_id);
                article.likes = article.likes.length;
                delete article.commentaires;
                data.push(article);
            }
            return res.json({
                success: true,
                data
            });
        } catch(err) {
            console.log(err, err.stack);
            return res.json({
                success: false,
                moreInfos: "Une erreur interne est survenue, merci de réessayer plus tard."
            });
        }
    });

    router.post('/articleDetails/:article', async function(req, res) {
        try {
            let article = await Article.findById(req.params.article)
            .populate({
                path: 'commentaires',
                populate: {
                    path: 'auteur',
                    select: '-_id username'
                }
            })
            .populate({
                path: 'auteur',
                select: '-_id username'
            });
            if (!article || (article.etat == Config.DELETED)) {
                throw new Error('Article supprimé !');
            }
            article = article.toObject();
            article.liked = article.likes.includes(req.body._id);
            article.likes = article.likes.length;
            for(const commentaire of article.commentaires) {
                commentaire.liked = commentaire.likes.includes(req.body._id);
                commentaire.likes = commentaire.likes.length;
            }
            article.commentaires = article.commentaires.filter(({etat}) => etat != Config.DELETED);
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
    

    router.post('/toggleLikeArticle/:article', async function(req, res) {
        try {
            let article = await Article.findById(req.params.article);
            let {_id} = req.body, index = 0;
            if (!_id || !article || (article.etat == Config.DELETED)) {
                throw new Error('Article supprimé !');
            }
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

    router.post('/postComment/:article', async function(req, res) {
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
                commentaire = commentaire.toObject();
                commentaire.liked = false;
                commentaire.likes = 0;
                return res.json({
                    success: true,
                    data: commentaire
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