
const express = require('express');
const router = express.Router();
const Stock = require('../models/Stock');

// CRUD pour Stock

// Récupérer tous les Stocks
router.get('/', async (req, res) => {
  try {
    const items = await Stock.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Créer un Stock
router.post('/', async (req, res) => {
  const newItem = new Stock(req.body);
  try {
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mettre à jour un Stock
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Supprimer un Stock
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await Stock.findByIdAndDelete(req.params.id);
    res.json(deletedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
