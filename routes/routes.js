var express = require('express');
var path = require('path');
var router = express.Router();

const casRoutes = require(path.join(__dirname, '/cas'));

casRoutes.populate(router);

module.exports = router;
