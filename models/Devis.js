const mongoose = require('mongoose');
const DevisSchema = new mongoose.Schema({
    utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
    categorieVehicule: { type: mongoose.Schema.Types.ObjectId, ref: 'CategorieVehicule', required: true },
    modeleVehicule: { type: mongoose.Schema.Types.ObjectId, ref: 'ModeleVehicule', required: true },
    marqueVehicule: { type: mongoose.Schema.Types.ObjectId, ref: 'MarqueVehicule', required: true },
    totalPrix: { type: Number, default: 0 },
    nombreMecanicien: { type: Number, default: 0 },
    totalHeure: { type: String, default: "" } // Stocké comme string HH:MM:SS
}, { timestamps: true });

const Devis = mongoose.model('Devis', DevisSchema);