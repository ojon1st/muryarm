const mongoose = require('mongoose');

const User = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    inscription: String
});

const $User = mongoose.model('User', User);
$User.createCollection().catch(console.log);

module.exports = $User;