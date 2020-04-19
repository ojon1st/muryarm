var path = require('path');
const Config = require(path.join(__dirname, '/../configs/config'))
const Mail = require(path.join(__dirname, '/../models/Mail'))

module.exports.populate = (router) => {
	
	/* Statistiques. */
	router.get('/cas/statistiques', function (req, res, next) {
		return res.json({
			deces: Config.CAS_DECEDES,
			guerisons: Config.CAS_GUERIS,
			confirmations: Config.CAS_CONFIRMES
		});
	});

	router.post('/sendAlert', async function(req, res) {
		try {
			await Mail.send({
				subject: 'COVID-19 -- Nouveau cas',
				to: `"MURYAR MATASSA" <contact@muryarmatassa.org>`,
				from: `"LANCEUR D'ALERTE CORONAVIRUS" <${Config.DEFAULT_EMAIL_USERNAME}>`,
				pretty: true,
				html: `
					<!DOCTYPE html lang="fr">
					<html>
						<head>
							<title>Alerte ! Nouveau cas du coronavirus</title>
							<meta charset="utf-8">
						</head>
						<body>
							<p>Bonjour,</p>
							<p>
								Nouvelle alerte reçue du cas de Covid-19:<br>
								<h3 style="margin:0"><u>Informations</u></h3>
								<u>Personne concernée:</u>&nbsp;<b>${req.body.sujet}</b><br>
								<u>Nom & prénom:</u>&nbsp;<b>${req.body.nomPrenom}</b><br>
								<u>Tranche d'âge:</u>&nbsp;<b>${req.body.age}</b><br>
								<u>Région:</u>&nbsp;<b>${req.body.region}</b><br>
								<u>Ville:</u>&nbsp;<b>${req.body.ville}</b><br>
								<u>Commune:</u>&nbsp;<b>${req.body.commune}</b><br>
								<u>Quartier:</u>&nbsp;<b>${req.body.quartier}</b><br>
								<u>Téléphone:</u>&nbsp;<b>${req.body.telephone}</b><br>
								<u>Fièvre:</u>&nbsp;<b>${req.body.fievre || 'Non'}</b><br>
								<u>Toux sèche:</u>&nbsp;<b>${req.body.toux || 'Non'}</b><br>
								<u>Difficultés respiratoires:</u>&nbsp;<b>${req.body.respiration || 'Non'}</b><br>
							</p>
							<p>Cordialement,</p>
						</body>
					</html>
				`
			});
			return res.json({
				success: true,
				moreInfos: "Votre alerte est enregistrée avec succès. Les services compétents se chargent de la traiter et de vous répondre dans les délais les plus brefs.\nMerci de respecter les règles d'hygiène pour limiter la propagation du Virus."
			});
		} catch(err) {
			console.log(err, err.stack);
			return res.json({
				success: false,
				moreInfos: "Une erreur est survenue lors du traitement de votre requête, merci de réessayer plus tard."
			});
		}
	})
	
};
