const path = require('path');
const mongoose = require('mongoose');
const Sondage = require(path.join(__dirname, '/../models/Sondage'));

module.exports.populate = (router) => {

    router.get('/sondageList', async function(req, res) {
        try {
            let sondages = await Sondage.find();
            return res.json({
                success: true,
                data: sondages
            });
        } catch(err) {
            console.log(err, err.stack);
            return res.json({
                success: false,
                moreInfos: "Erreur lors de la récupération des sondages."
            });
        }
    });

    router.put('/addResponses', async function(req, res) {
        let session;
        try {

            let {responses, userId} = req.body;
            let toUpdate = [];
            
            session = await mongoose.startSession();
            session.startTransaction();

            for(const response of responses) {
                let sondage = await Sondage.findById(response.sondageId);
                if(sondage.selectedResponses.map(r => r.user.toString()).includes(userId)) {
                    continue;
                } else {
                    sondage.selectedResponses.push({
                        user: userId,
                        responses: response.data
                    });
                    toUpdate.push(sondage.save({session}));
                }
            }
            await Promise.all(toUpdate);
            await session.commitTransaction();
            return res.json({
                success: true,
                moreInfos: "Réponses envoyées."
            });

        } catch(err) {
            if(session) {
                await session.abortTransaction();
                session.endSession();
            }
            console.log(err, err.stack);
            return res.json({
                success: false,
                moreInfos: "Erreur lors de l'envoie de votre réponse. Veuillez réessayer !"
            });
        }
    });


    router.get('/sondageResults', async function(req, res) {
        try {
            let sondages = await Sondage.find();
            let sd = []
            for (s of sondages) {
                let responses = s.responses;
                let selected = s.selectedResponses;
                let res = []
                for (response of responses) {
                    console.log(response)
                    let nombreChoix = selected.filter(r => console.log(r) || r.responses.includes(response.value)).length;
                    res.push({ label: response.label, nombre: nombreChoix });
                }
                sd.push({
                    _id: s._id,
                    question: s.question,
                    responses: res,
                    total: selected.length
                });
            }
            return res.json({
                success: true,
                data: sd
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