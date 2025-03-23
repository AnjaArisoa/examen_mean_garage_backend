const mongoose = require('mongoose');
const PiecesSchema = new mongoose.Schema({
    nomPiece: { type: String, required: true },
    reference: { type: String, required: true },
    categorieVehicule: { type: mongoose.Schema.Types.ObjectId, ref: 'CategorieVehicule', required: true },
    modeleVehicule: { type: mongoose.Schema.Types.ObjectId, ref: 'ModeleVehicule', required: true },
    marqueVehicule: { type: mongoose.Schema.Types.ObjectId, ref: 'MarqueVehicule', required: true },
    prix: { type: Number, required: true }
}, { timestamps: true });

const Pieces = mongoose.model('Pieces', PiecesSchema);