const mongoose = require('mongoose');
const DuretacheSchema = new mongoose.Schema({
    _idtache: { type: mongoose.Schema.Types.ObjectId,ref: 'Tache', required: true},
    _idcategorievehicule: { type: mongoose.Schema.Types.ObjectId,ref: 'Categorievehicule', required: true},
    duree: {type: String,  required: true },
    nombremecanicien: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Duretache', DuretacheSchema);
