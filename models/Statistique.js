const mongoose = require('mongoose');
const path = require('path');

const Statistique = new mongoose.Schema({
    page: String,
    project: String,
    consultations: [{
        date: String,
        visites: [{
            user: String,
            occurrences: Number
        }]
    }]
});

module.exports = mongoose.model('Statistique', Statistique);