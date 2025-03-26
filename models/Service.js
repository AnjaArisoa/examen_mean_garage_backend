const mongoose = require("mongoose");
const ServiceSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    description: { type: String, required: true },
    img: { type: String, required: false,default:"" },
    etat: { type: Number, default: 0 } // 0 = inactif, 1 = actif (optionnel)
  },
  { timestamps: true } // Ajoute les champs createdAt et updatedAt
);
module.exports = mongoose.model("Service", ServiceSchema);
