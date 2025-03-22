const mongoose = require('mongoose');
const RendezvousSchema = new mongoose.Schema({
  _idUtilisateur: {type: mongoose.Schema.Types.ObjectId,ref: 'Utilisateur', required: true},
  _idDevis: {type: mongoose.Schema.Types.ObjectId,ref: 'Devis', required: true},
  matriculation: {type: String, required: true},
  daterdv: { type: Date, required: true },
  heuredebut: { type: String, required: true },
  heurefin: { type: String, required: true }
}, { timestamps: true });
module.exports = mongoose.model('Rendezvous', RendezvousSchema);
