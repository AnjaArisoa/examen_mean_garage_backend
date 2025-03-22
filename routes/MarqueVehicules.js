
const express = require('express');
const router = express.Router();
const MarqueVehicule = require('../models/MarqueVehicule');

// CRUD pour MarqueVehicule

// Récupérer tous les MarqueVehicules
router.get('/', async (req, res) => {
  try {
    const items = await MarqueVehicule.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Créer un MarqueVehicule
router.post('/', async (req, res) => {
  const newItem = new MarqueVehicule(req.body);
  try {
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mettre à jour un MarqueVehicule
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await MarqueVehicule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Supprimer un MarqueVehicule
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await MarqueVehicule.findByIdAndDelete(req.params.id);
    res.json(deletedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
