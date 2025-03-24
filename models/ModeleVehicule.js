const mongoose = require('mongoose');
const ModeleVehiculeSchema = new mongoose.Schema({
    modeleVehicule: { type: String, required: true },
    _idmarquevehicule: {type: mongoose.Schema.Types.ObjectId,ref: 'MarqueVehicule', required: true},
    etat: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('ModeleVehicule', ModeleVehiculeSchema);