
const express = require('express');
const router = express.Router();
const Devis = require('../models/Devis');

// CRUD pour Devis

// Récupérer tous les Devis
router.get('/', async (req, res) => {
  try {
    const items = await Devis.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Créer un Devis
router.post('/', async (req, res) => {
  const newItem = new Devis(req.body);
  try {
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mettre à jour un Devis
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Devis.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Supprimer un Devis
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await Devis.findByIdAndDelete(req.params.id);
    res.json(deletedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
