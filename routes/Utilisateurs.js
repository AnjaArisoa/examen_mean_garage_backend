
const express = require('express');
const router = express.Router();
const Utilisateur = require('../models/Utilisateur');

// CRUD pour Utilisateur

// Récupérer tous les Utilisateurs
router.get('/', async (req, res) => {
  try {
    const items = await Utilisateur.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Créer un Utilisateur
router.post('/', async (req, res) => {
  const newItem = new Utilisateur(req.body);
  try {
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mettre à jour un Utilisateur
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Utilisateur.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Supprimer un Utilisateur
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await Utilisateur.findByIdAndDelete(req.params.id);
    res.json(deletedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
