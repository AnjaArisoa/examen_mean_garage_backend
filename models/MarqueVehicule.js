const mongoose = require('mongoose');
const MarqueVehiculeSchema = new mongoose.Schema({
    marqueVehicule: { type: String, required: true },
    etat: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('MarqueVehicule', MarqueVehiculeSchema);