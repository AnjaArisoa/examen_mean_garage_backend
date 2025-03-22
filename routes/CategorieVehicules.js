
const express = require('express');
const router = express.Router();
const CategorieVehicule = require('../models/CategorieVehicule');

// CRUD pour CategorieVehicule

// Récupérer tous les CategorieVehicules
router.get('/', async (req, res) => {
  try {
    const items = await CategorieVehicule.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Créer un CategorieVehicule
router.post('/', async (req, res) => {
  const newItem = new CategorieVehicule(req.body);
  try {
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mettre à jour un CategorieVehicule
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await CategorieVehicule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Supprimer un CategorieVehicule
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await CategorieVehicule.findByIdAndDelete(req.params.id);
    res.json(deletedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
