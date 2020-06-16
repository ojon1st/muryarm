const mongoose = require('mongoose');

const User = new mongoose.Schema({
    noms: String,
    email: String,
    telephone: String,
    id: Number,
    inscription: String,
    project: String
});

module.exports = mongoose.model('User', User);