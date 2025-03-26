const mongoose = require('mongoose');
const MajorationSchema = new mongoose.Schema({
  pourcentage: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Majoration', MajorationSchema);
