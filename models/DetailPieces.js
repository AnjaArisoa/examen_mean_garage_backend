const mongoose = require('mongoose');
const DetailDevisSchema = new mongoose.Schema({
    devis: { type: mongoose.Schema.Types.ObjectId, ref: 'Devis', required: true },
    tache: { type: mongoose.Schema.Types.ObjectId, ref: 'Tache', required: true },
    pieces: { type: mongoose.Schema.Types.ObjectId, ref: 'Pieces', default: null },
    prixTache: { type: Number, required: true },
    dureTache: { type: Number, required: true }, // Stocké comme string HH:MM:SS
    nombrePieces: { type: Number, required: false,default:0 },
    etat: {type: Number,required:false,default:0}
}, { timestamps: true });

module.exports = mongoose.model('DetailDevis', DetailDevisSchema);