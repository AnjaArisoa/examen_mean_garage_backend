
const express = require('express');
const router = express.Router();
const CommandePieces = require('../models/CommandePieces');

// CRUD pour CommandePieces

// Récupérer tous les CommandePieces
router.get('/', async (req, res) => {
  try {
    const items = await CommandePieces.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Créer un CommandePieces
router.post('/', async (req, res) => {
  const newItem = new CommandePieces(req.body);
  try {
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mettre à jour un CommandePieces
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await CommandePieces.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Supprimer un CommandePieces
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await CommandePieces.findByIdAndDelete(req.params.id);
    res.json(deletedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
