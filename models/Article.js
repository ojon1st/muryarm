const path = require('path');
const mongoose = require('mongoose');

const User = require(path.join(__dirname, '/User'));
const Commentaire = require(path.join(__dirname, '/Commentaire'));
const Config = require(path.join(__dirname, '/../configs/config'));

const Article = new mongoose.Schema({
    auteur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    contenu: {
        type: String,
        required: true
    },
    likes: {
        type: [String],
        default: []
    },
    etat: {
        type: String,
        enum: Config.getEtats(),
        default: Config.DEFAULT
    },
    commentaires: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: Commentaire,
            required: true
        }],
        default: []
    },
    date: String
});

let $Article = mongoose.model('Article', Article);
$Article.createCollection().catch(console.log);

module.exports = $Article;