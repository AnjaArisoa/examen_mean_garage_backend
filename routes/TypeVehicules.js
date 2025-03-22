
const express = require('express');
const router = express.Router();
const TypeVehicule = require('../models/TypeVehicule');

// CRUD pour TypeVehicule

// Récupérer tous les TypeVehicules
router.get('/', async (req, res) => {
  try {
    const items = await TypeVehicule.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Créer un TypeVehicule
router.post('/', async (req, res) => {
  const newItem = new TypeVehicule(req.body);
  try {
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mettre à jour un TypeVehicule
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await TypeVehicule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Supprimer un TypeVehicule
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await TypeVehicule.findByIdAndDelete(req.params.id);
    res.json(deletedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
