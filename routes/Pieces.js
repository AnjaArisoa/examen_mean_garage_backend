
const express = require('express');
const router = express.Router();
const Pieces = require('../models/Pieces');

// CRUD pour Pieces

// Récupérer tous les Pieces
router.get('/', async (req, res) => {
  try {
    const items = await Pieces.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Créer un Pieces
router.post('/', async (req, res) => {
  const newItem = new Pieces(req.body);
  try {
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mettre à jour un Pieces
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Pieces.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Supprimer un Pieces
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await Pieces.findByIdAndDelete(req.params.id);
    res.json(deletedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
