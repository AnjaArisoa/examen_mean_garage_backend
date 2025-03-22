
const express = require('express');
const router = express.Router();
const Majoration = require('../models/Majoration');

// CRUD pour Majoration

// Récupérer tous les Majorations
router.get('/', async (req, res) => {
  try {
    const items = await Majoration.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Créer un Majoration
router.post('/', async (req, res) => {
  const newItem = new Majoration(req.body);
  try {
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mettre à jour un Majoration
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Majoration.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Supprimer un Majoration
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await Majoration.findByIdAndDelete(req.params.id);
    res.json(deletedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
