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
				subject: 'Nouveau cas',
				to: `"MURYAR MATASSA" <${Config.DEFAULT_EMAIL_USERNAME}>`,
				from: `"ALERTE CORONAVIRUS" <${Config.DEFAULT_EMAIL_USERNAME}>`,
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
								Nouvelle alerte reçue du cas de Covid-19:<br><br>
								<h2 style="margin:0">Informations</h2 style="margin:0"><br><br>
								<h3>Nom & prénom:</h3>&nbsp;${req.body.nomPrenom}<br>
								<h3>Tranche d'âge:</h3>&nbsp;${req.body.age}<br>
								<h3>Région:</h3>&nbsp;${req.body.region}<br>
								<h3>Localité:</h3>&nbsp;${req.body.localite}<br>
								<h3>Téléphone:</h3>&nbsp;${req.body.telephone}<br>
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
