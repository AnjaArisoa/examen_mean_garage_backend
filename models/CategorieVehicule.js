const mongoose = require('mongoose');
const CategorieVehiculeSchema = new mongoose.Schema({
    typeVehicule: { type: mongoose.Schema.Types.ObjectId, ref: 'TypeVehicule', required: true },
    typeMoteur: { type: mongoose.Schema.Types.ObjectId, ref: 'TypeMoteur', required: true },
    coefficient: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('CategorieVehicule', CategorieVehiculeSchema);
