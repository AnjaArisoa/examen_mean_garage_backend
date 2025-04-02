const mongoose = require("mongoose");
const TacheSchema = new mongoose.Schema(
  {
    _idService: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    nom: { type: String, required: true },
    description: { type: String, required: true },
    prix: { type: Number, required: true },
    nombremeca: { type: Number, required: true },
    etat: { type: Number, default: 0 } 
  },
  { timestamps: true }
);
module.exports = mongoose.model("Tache", TacheSchema);
