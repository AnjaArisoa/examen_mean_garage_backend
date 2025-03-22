
const express = require('express');
const router = express.Router();
const TachePieces = require('../models/TachePieces');

// CRUD pour TachePieces

// Récupérer tous les TachePieces
router.get('/', async (req, res) => {
  try {
    const items = await TachePieces.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Créer un TachePieces
router.post('/', async (req, res) => {
  const newItem = new TachePieces(req.body);
  try {
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mettre à jour un TachePieces
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await TachePieces.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Supprimer un TachePieces
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await TachePieces.findByIdAndDelete(req.params.id);
    res.json(deletedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
