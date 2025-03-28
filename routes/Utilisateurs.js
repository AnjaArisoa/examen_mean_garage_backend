
const express = require('express');
const router = express.Router();
const User = require('../models/Utilisateur');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'monSecret';

// Middleware de vérification du token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'Accès refusé' });

  jwt.verify(token.split(' ')[1], JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token invalide' });
    req.user = decoded;
    next();
  });
};

// Inscription
router.post('/register', async (req, res) => {
  const { nom, prenom, phone, email, mdp } = req.body;
  console.log(req.body);  // Ajoutez cette ligne pour voir ce que vous recevez

  if (!nom || !prenom || !phone || !email || !mdp ) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: 'L\'email ou le téléphone est déjà utilisé' });
    }

    const hashedmdp = await bcrypt.hash(mdp, 10);
    const newUser = new User({ nom, prenom, phone, email, mdp: hashedmdp });

    await newUser.save();

    res.status(201).json({ message: 'Utilisateur créé' });
  } catch (err) {
    console.log(err);  // Ajoutez cette ligne pour voir l'erreur exacte
    res.status(400).json({ message: err.message });
  }
});



// Connexion
router.post('/login', async (req, res) => {
  const { email, mdp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Utilisateur non trouvé' });

    const isMatch = await bcrypt.compare(mdp, user.mdp);
    if (!isMatch) return res.status(400).json({ message: 'Mot de passe incorrect' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '10s' });

    res.json({ token, role: user.role,id: user._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Profil protégé
router.get('/profile', verifyToken, (req, res) => {
  res.json({ message: 'Données sécurisées', user: req.user });
});

module.exports = router;
