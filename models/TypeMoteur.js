const mongoose = require('mongoose');

const TypeMoteurSchema = new mongoose.Schema({
    nomTypeMoteur: { type: String, required: true },
    etat: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('TypeMoteur', TypeMoteurSchema);