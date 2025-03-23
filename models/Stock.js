const mongoose = require('mongoose');
const StockSchema = new mongoose.Schema({
    pieces: { type: mongoose.Schema.Types.ObjectId, ref: 'Pieces', required: true },
    entree: { type: Number, default: null },
    sortie: { type: Number, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Stock', StockSchema);