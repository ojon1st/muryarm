var express = require('express');
var path = require('path');
var router = express.Router();

const casRoutes = require(path.join(__dirname, '/cas'));
const userRoutes = require(path.join(__dirname, '/user'));
const sondageRoutes = require(path.join(__dirname, '/sondage'));

casRoutes.populate(router);
userRoutes.populate(router);
sondageRoutes.populate(router);

module.exports = router;
