const mongoose = require('mongoose');
const MecarendezvousSchema = new mongoose.Schema({
  _idrendezvous: {type: mongoose.Schema.Types.ObjectId,ref: 'Rendezvous', required: true},
  _idUtilisateur: {type: mongoose.Schema.Types.ObjectId,ref: 'Utilisateur', required: true},
  etat: {type: Number, default: 0}
}, { timestamps: true });
module.exports = mongoose.model('Mecarendezvous', MecarendezvousSchema);
