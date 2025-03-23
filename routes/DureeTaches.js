
const express = require('express');
const router = express.Router();
const DureeTache = require('../models/DureeTache');

// CRUD pour DureeTache

// Récupérer tous les DureeTaches
router.get('/', async (req, res) => {
  try {
    const items = await DureeTache.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Créer un DureeTache
router.post('/', async (req, res) => {
  const newItem = new DureeTache(req.body);
  try {
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mettre à jour un DureeTache
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await DureeTache.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Supprimer un DureeTache
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await DureeTache.findByIdAndDelete(req.params.id);
    res.json(deletedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
