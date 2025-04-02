const mongoose = require('mongoose');
const ReservationPiecesSchema = new mongoose.Schema({
    _rdv: {type: mongoose.Schema.Types.ObjectId,ref: 'RendezVous', required: true},
    pieces: {type: mongoose.Schema.Types.ObjectId,ref: 'Pieces', required: true},
    nombre:{ type: Number, required: true },
    etat: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('ReservationPieces', ReservationPiecesSchema);