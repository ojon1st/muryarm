var path = require('path');
const Config = require(path.join(__dirname, '/../configs/config'))
const Mail = require(path.join(__dirname, '/../models/Mail'))

module.exports.populate = (router => {
	
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
				subject: 'COROVID-19 -- Nouveau cas',
				to: `"MURYAR MATASSA" <${Config.DEFAULT_EMAIL_USERNAME}>`,
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
								<u>Nom & prénom:</u>&nbsp;<b>${req.body.nomPrenom}</b><br>
								<u>Tranche d'âge:</u>&nbsp;<b>${req.body.age}</b><br>
								<u>Région:</u>&nbsp;<b>${req.body.region}</b><br>
								<u>Localité:</u>&nbsp;<b>${req.body.localite}</b><br>
								<u>Téléphone:</u>&nbsp;<b>${req.body.telephone}</b><br>
							</p>
							<p>Cordialement,</p>
						</body>
					</html>
				`
			});
			return res.json({
				success: true,
				moreInfos: "Votre alerte est reçue par les services sanitaires compétents. Vous recevrez une assistante dans si peu, merci de respecter les règles d'hygiène pour limiter la propagation du virus."
			});
		} catch(err) {
			console.log(err, err.stack);
			return res.json({
				success: false,
				moreInfos: "Une erreur est survenue lors du traitement de votre requête, merci de réessayer plus tard."
			});
		}
	})
	
});
