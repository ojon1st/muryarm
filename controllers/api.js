const path = require('path');
const User = require(path.join(__dirname, '../models/User'));
const Statistique = require(path.join(__dirname, '../models/Statistique'));


module.exports = {

    async userAdded(req, res) {

        if(
            req.body.noms &&
            req.body.email &&
            req.body.telephone &&
            req.body.id &&
            req.body.project
        ) {
            try {

                if(!res.app.locals.projectsNames.includes(req.body.project)) {
                    return res.json({
                        success: false,
                        moreInfos: "Ce project est inconnu !"
                    });
                }
                
                await new User(req.body).save();
                return res.json({
                    success: true,
                    moreInfos: 'Utilisateur ajouté avec succès !'
                });

            } catch(err) {

                console.log(err, err.stack);
                return res.json({
                    success: false,
                    moreInfos: "Une erreur est survenue lors de l'ajout de cet utilisateur, merci de réessayer plus tard."
                });

            }

        } else {

            return res.json({
                success: false,
                moreInfos: "Les informations réquises sont: NOMS, EMAIL, TELEPHONE, ID, PROJECT"
            });

        }
    },

    async pageVisited(req, res) {

        if(
            req.body.user && 
            req.body.page && 
            req.body.project
        ) {
            try {

                if(!res.app.locals.projectsNames.includes(req.body.project)) {
                    return res.json({
                        success: false,
                        moreInfos: "Ce project est inconnu !"
                    });
                }
                
                let visite = {
                    user: req.body.user,
                    occurrences: 1
                };
                let today = new Date();
                let jour = today.getDate();
                let mois = today.getMonth();
                let date = new Date(`${today.getFullYear()}-${mois < 9 ? '0':''}${mois+1}-${jour < 10 ? '0':''}${jour}`);
                let statistique;

                // les statistiques de la page. 
                [statistique] = res.app.locals.statistiques.filter(s => (s.page == req.body.page) && (s.project == req.body.project));
                if(statistique) {

                    // Les consultations du jour.
                    let [consultations] = statistique.consultations.filter(s => s.date == date.toGMTString());
                    if(consultations) {

                        // Visites de l'utilisateur courant.
                        let [consultation] = consultations.visites.filter(c => c.user == req.body.user);

                        if(consultation) {
                            consultation.occurrences++;
                        } else {
                            consultations.push(visite);
                        }

                    } else {

                        statistique.consultations.push({
                            date: date.toISOString(),
                            visites: [visite]
                        });

                    }

                } else {

                    statistique = new Statistique({
                        page: req.body.page,
                        project: req.body.page,
                        consultations: [{
                            date: date.toISOString(),
                            visites: [visite]
                        }]
                    });

                }
                
                await statistique.save();

                return res.json({
                    success: true,
                    moreInfos: "Visite enregistrée avec succès."
                });

            } catch(err) {

                console.log(err, err.stack);
                return res.json({
                    success: false,
                    moreInfos: "Une erreur interne est survenue, merci de réesayer plus tard."
                });

            }

        } else {

            return res.json({
                success: false,
                moreInfos: "Les informations réquises sont : USER, PAGE, PROJECT."
            });

        }
        
    }
    
};