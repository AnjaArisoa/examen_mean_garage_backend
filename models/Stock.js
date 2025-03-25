const mongoose = require('mongoose');
const StockSchema = new mongoose.Schema({
    pieces: { type: mongoose.Schema.Types.ObjectId, ref: 'Pieces', required: true },
    entree: { type: Number, default: 0 },
    sortie: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Stock', StockSchema);