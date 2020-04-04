const path = require('path');
const mongoose = require('mongoose');

const User = require(path.join(__dirname, '/User'))
const Config = require(path.join(__dirname, '/../configs/config'))

const Commentaire = new mongoose.Schema({
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
    date: String
});

let $Commentaire = mongoose.model('Commentaire', Commentaire);
$Commentaire.createCollection().catch(console.log);

module.exports = $Commentaire;
