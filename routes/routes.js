var express = require('express');
var path = require('path');
var router = express.Router();

const casRoutes = require(path.join(__dirname, '/cas'));
const apiRoutes = require(path.join(__dirname, '/api'));

apiRoutes.populate(router);
casRoutes.populate(router);

module.exports = router;