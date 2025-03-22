const mongoose = require('mongoose');
const TypeVehiculeSchema = new mongoose.Schema({
    nomTypeVehicule: { type: String, required: true },
    etat: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('TypeVehicule', TypeVehiculeSchema);