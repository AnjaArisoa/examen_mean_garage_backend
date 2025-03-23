
const express = require('express');
const router = express.Router();
const RendezVous = require('../models/RendezVous');

// CRUD pour RendezVous

// Récupérer tous les RendezVous
router.get('/', async (req, res) => {
  try {
    const items = await RendezVous.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Créer un RendezVous
router.post('/', async (req, res) => {
  const newItem = new RendezVous(req.body);
  try {
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mettre à jour un RendezVous
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await RendezVous.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Supprimer un RendezVous
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await RendezVous.findByIdAndDelete(req.params.id);
    res.json(deletedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
