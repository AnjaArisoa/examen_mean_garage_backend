const mongoose = require('mongoose');
const ReductionSchema = new mongoose.Schema({
  reduction: { type: Number, required: true }
}, { timestamps: true });
module.exports = mongoose.model('Reduction', ReductionSchema);
