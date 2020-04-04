var express = require('express');
var path = require('path');
var router = express.Router();

const casRoutes = require(path.join(__dirname, '/cas'));
const userRoutes = require(path.join(__dirname, '/user'));
const sondageRoutes = require(path.join(__dirname, '/sondage'));
const articleRoutes = require(path.join(__dirname, '/article'));
const commentaireRoutes = require(path.join(__dirname, '/commentaire'));

casRoutes.populate(router);
userRoutes.populate(router);
sondageRoutes.populate(router);
commentaireRoutes.populate(router);
articleRoutes.populate(router);

module.exports = router;
