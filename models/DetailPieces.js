const mongoose = require('mongoose');
const DetailDevisSchema = new mongoose.Schema({
    devis: { type: mongoose.Schema.Types.ObjectId, ref: 'Devis', required: true },
    tache: { type: mongoose.Schema.Types.ObjectId, ref: 'Tache', required: true },
    pieces: { type: mongoose.Schema.Types.ObjectId, ref: 'Pieces', default: null },
    prixTache: { type: Number, required: true },
    dureTache: { type: String, required: true }, // Stocké comme string HH:MM:SS
    nombrePieces: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('DetailDevis', DetailDevisSchema);