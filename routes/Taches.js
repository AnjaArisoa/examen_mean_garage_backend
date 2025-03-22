
const express = require('express');
const router = express.Router();
const Tache = require('../models/Tache');

// CRUD pour Tache

// Récupérer tous les Taches
router.get('/', async (req, res) => {
  try {
    const items = await Tache.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Créer un Tache
router.post('/', async (req, res) => {
  const newItem = new Tache(req.body);
  try {
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mettre à jour un Tache
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Tache.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Supprimer un Tache
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await Tache.findByIdAndDelete(req.params.id);
    res.json(deletedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
