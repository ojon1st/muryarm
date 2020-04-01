const mongoose = require('mongoose');
const path = require('path');

const Sondage = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    description: String,
    type: {
        type: String,
        enum: ['__RADIO__', '__CHECKBOX__'],
        required: true
    },
    responses: [{
        label: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        }
    }],
    selectedResponses: [{
        user: String,
        responses: [String]
    }]
});
 
const $Sondage = mongoose.model('Sondage', Sondage);
$Sondage.createCollection().catch(console.log);

module.exports = $Sondage;