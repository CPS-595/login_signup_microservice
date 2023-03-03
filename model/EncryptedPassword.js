const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EncryptedPasswordSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    credentialId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource',
        required: true
    },
    password: {
        type: String,
        required: true
    },
    dateTime: {
        type: Date,
        default: Date.now,
        required: true
    },
});

module.exports = mongoose.model('EncryptedPassword', EncryptedPasswordSchema);