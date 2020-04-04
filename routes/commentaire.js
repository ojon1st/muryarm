const path = require('path');

const Commentaire = require(path.join(__dirname, '/../models/Commentaire'));
const Config = require(path.join(__dirname, '/../configs/config'));

module.exports.populate = (router) => {
    
    router.post('/toggleLikeComment/:commentaire', async function(req, res) {
        try {
            let commentaire = await Commentaire.findById(req.params.commentaire);
            if(!commentaire || (commentaire.etat == Config.DELETED)) {
                throw new Error('Commentaire supprimé !');
            }
            let { _id } = req.body, index = false;
            if (!~(index = commentaire.likes.indexOf(_id))) {
                commentaire.likes.addToSet(_id);
            } else {
                commentaire.likes.splice(index, 1);
            }
            await commentaire.save();
            return res.json({
                success: true,
                liked: !~index
            })
        } catch(err) {
            console.log(err, err.stack);
            return res.json({
                success: false,
                moreInfos: "Une erreur est survenue, merci de réessayer plus tard."
            })
        }
    });

    router.post('/removeComment/:commentaire', async function(req, res) {
        try {
            let commentaire = await Commentaire.findById(req.params.commentaire);
            if (!commentaire || (commentaire.etat == Config.DELETED)) {
                throw new Error('Commentaire supprimé !');
            }
            commentaire.etat = Config.DELETED;
            await commentaire.save();
            return res.json({
                success: true,
                moreInfos: "Commentaire supprimé !"
            });
        } catch (err) {
            console.log(err, err.stack);
            return res.json({
                success: false,
                moreInfos: "Une erreur est survenue, merci de réessayer plus tard."
            });
        }
    });
    
}