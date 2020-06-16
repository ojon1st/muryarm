var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

const Config = require(path.join(__dirname, '/configs/config'));
var router = require('./routes/routes');

var app = express();

app.locals.projectsNames = [
    '__MURYARMATASSA__'
];

const mongoose = require('mongoose');
const options = {
    // replicaSet: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
};

mongoose.connect(Config.DATABASE, options);

mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur de connexion à la base de données.'));

db.once('open', () => {
    console.clear();
    console.log("Connexion avec le serveur des bases de données établie.");
});

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/', router);

module.exports = app;
