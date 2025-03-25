const mongoose = require("mongoose");

//npm install bcryptjs

const UtilisateurSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    mdp: { type: String, required: true },
    role: { 
      type: String, 
      enum: ["manager", "client", "mecanicien"], 
      default: "client"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Utilisateur", UtilisateurSchema);
