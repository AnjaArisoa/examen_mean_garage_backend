
const express = require('express');
const router = express.Router();
const TypeMoteur = require('../models/TypeMoteur');

// CRUD pour TypeMoteur

// Récupérer tous les TypeMoteurs
router.get('/', async (req, res) => {
  try {
    const items = await TypeMoteur.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Créer un TypeMoteur
router.post('/', async (req, res) => {
  const newItem = new TypeMoteur(req.body);
  try {
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mettre à jour un TypeMoteur
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await TypeMoteur.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Supprimer un TypeMoteur
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await TypeMoteur.findByIdAndDelete(req.params.id);
    res.json(deletedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
