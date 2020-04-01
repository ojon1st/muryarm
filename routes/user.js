const path = require('path');
const bcryptjs = require('bcryptjs');
const User = require(path.join(__dirname, '/../models/User'));

module.exports.populate = (router) => {

    router.post('/addUser', async function(req, res) {
        console.log(req.body)
        const {username, password} = req.body;
        try {
            if(username && password){
                if(await User.find({username}).countDocuments() > 0) {
                    return res.json({
                        success: false,
                        moreInfos: "Ce nom d'utilisateur est déjà réservé, merci d'en choisir un autre."
                    });
                }
                let user = new User({username, password: await bcryptjs.hash(password, 10), inscription: new Date().toISOString()})
                await user.save();
                user = user.toObject();
                delete user.password;
                return res.json({
                    success: true,
                    data: user,
                    moreInfos: 'Utilisateur ajouté !'
                });
            }
            return res.json({
                success: false,
                moreInfos: "Quelques informations sont manquantes."
            });
        } catch(err) {
            console.log(err, err.stack);
            return res.json({
                success: false,
                moreInfos: "Une erreur interne est survenue, merci de réessayer plus tard."
            })
        }
    });


    router.post('/connectUser', async function(req, res) {
        try {
            let {username, password} = req.body;
            if(username && password) {
                let user = await User.findOne({username});
                if(user) {
                    await bcryptjs.compare(password, user.password);
                    user = user.toObject();
                    delete user.password;
                    return res.json({
                        success: true,
                        moreInfos: "Connexion réussie !",
                        data: user
                    });
                }
                return res.json({
                    success: false,
                    moreInfos: "Impossible de trouver l'utilisateur correspondant à ces informations."
                });
            }
            return res.json({
                success: false,
                moreInfos: "Certaines informations sont manquantes."
            });
        } catch(err) {
            console.log(err, err.stack);
            return res.json({
                success: false,
                moreInfos: "Une erreur interne est survenue, merci de réessayer plus tard."
            });
        }
    });
}

