
const express = require('express');
const router = express.Router();
const DetailPieces = require('../models/DetailPieces');

// CRUD pour DetailPieces

// Récupérer tous les DetailPieces
router.get('/', async (req, res) => {
  try {
    const items = await DetailPieces.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Créer un DetailPieces
router.post('/', async (req, res) => {
  const newItem = new DetailPieces(req.body);
  try {
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mettre à jour un DetailPieces
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await DetailPieces.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Supprimer un DetailPieces
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await DetailPieces.findByIdAndDelete(req.params.id);
    res.json(deletedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
