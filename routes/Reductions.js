
const express = require('express');
const router = express.Router();
const Reduction = require('../models/Reduction');

// CRUD pour Reduction

// Récupérer tous les Reductions
router.get('/', async (req, res) => {
  try {
    const items = await Reduction.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Créer un Reduction
router.post('/', async (req, res) => {
  const newItem = new Reduction(req.body);
  try {
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mettre à jour un Reduction
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Reduction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Supprimer un Reduction
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await Reduction.findByIdAndDelete(req.params.id);
    res.json(deletedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
