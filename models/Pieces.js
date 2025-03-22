const mongoose = require('mongoose');
const PiecesSchema = new mongoose.Schema({
    nomPiece: { type: String, required: true },
    reference: { type: String, required: true },
    categorieVehicule: { type: mongoose.Schema.Types.ObjectId, ref: 'CategorieVehicule', required: true },
    modeleVehicule: { type: String, required: true },
    prix: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Pieces', PiecesSchema);