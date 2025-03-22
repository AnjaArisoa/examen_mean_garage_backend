const mongoose = require('mongoose');
const ReductionSchema = new mongoose.Schema({
  _idtache: { type: mongoose.Schema.Types.ObjectId, ref: 'Tache', required: true },
  reduction: { type: Number, required: true }
}, { timestamps: true });
module.exports = mongoose.model('Reduction', ReductionSchema);
