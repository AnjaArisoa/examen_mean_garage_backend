const mongoose = require('mongoose');
const ModeleVehiculeSchema = new mongoose.Schema({
    modeleVehicule: { type: String, required: true },
    etat: { type: Number, default: 0 }
}, { timestamps: true });

const ModeleVehicule = mongoose.model('ModeleVehicule', ModeleVehiculeSchema);