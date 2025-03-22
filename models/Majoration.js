const mongoose = require('mongoose');
const MajorationSchema = new mongoose.Schema({
  _idtache: { type: mongoose.Schema.Types.ObjectId, ref: 'Tache',required: true },
  pourcentage: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Majoration', MajorationSchema);
