const mongoose = require('mongoose');
const CommandePiecesSchema = new mongoose.Schema({
    pieces: { type: mongoose.Schema.Types.ObjectId, ref: 'Pieces', required: true },
    nombre: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('CommandePieces', CommandePiecesSchema);