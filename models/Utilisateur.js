const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
      enum: ["admin", "utilisateur", "moderateur"], 
      default: "utilisateur" 
    }
  },
  { timestamps: true }
);

// 📌 Hash du mot de passe avant sauvegarde
UtilisateurSchema.pre("save", async function (next) {
  if (!this.isModified("mdp")) return next();
  const salt = await bcrypt.genSalt(10);
  this.mdp = await bcrypt.hash(this.mdp, salt);
  next();
});

// 📌 Vérifier le mot de passe
UtilisateurSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.mdp);
};

module.exports = mongoose.model("Utilisateur", UtilisateurSchema);
