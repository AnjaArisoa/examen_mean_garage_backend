const mongoose = require('mongoose');
const TachePiecesSchema = new mongoose.Schema({
    tache: { type: mongoose.Schema.Types.ObjectId, ref: 'Tache', required: true },
    pieces: { type: mongoose.Schema.Types.ObjectId, ref: 'Pieces', required: true },
    nombre: { type: Number, required: true },
    modifiable: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('TachePieces', TachePiecesSchema);