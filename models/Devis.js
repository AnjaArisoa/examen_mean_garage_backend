const mongoose = require('mongoose');
const DevisSchema = new mongoose.Schema({
    utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
    typeVehicule: { type: mongoose.Schema.Types.ObjectId, ref: 'TypeVehicule', required: true },
    totalPrix: { type: Number, required: true },
    nombreMecanicien: { type: Number, required: true },
    totalHeure: { type: String, required: true } // Stocké comme string HH:MM:SS
}, { timestamps: true });

module.exports = mongoose.model('Devis', DevisSchema);