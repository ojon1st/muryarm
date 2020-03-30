var path = require('path');
const Config = require(path.join(__dirname, '/../configs/config'))

module.exports.populate = (router => {
	
	/* Statistiques. */
	router.get('/cas/statistiques', function (req, res, next) {
		return res.json({
			deces: Config.CAS_DECEDES,
			guerisons: Config.CAS_GUERIS,
			confirmations: Config.CAS_CONFIRMES
		});
	});
	
});
