const mongoose = require('mongoose');
const DevisSchema = new mongoose.Schema({
    utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
    categorieVehicule: { type: mongoose.Schema.Types.ObjectId, ref: 'CategorieVehicule', required: true },
    modeleVehicule: { type: mongoose.Schema.Types.ObjectId, ref: 'ModeleVehicule', required: true },
    marqueVehicule: { type: mongoose.Schema.Types.ObjectId, ref: 'MarqueVehicule', required: true },
    totalPrix: { type: Number, required: true },
    nombreMecanicien: { type: Number, required: true },
    totalHeure: { type: String, required: true } // Stocké comme string HH:MM:SS
}, { timestamps: true });

const Devis = mongoose.model('Devis', DevisSchema);