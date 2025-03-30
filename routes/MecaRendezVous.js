
const express = require('express');
const router = express.Router();
const MecaRendezVous = require('../models/MecaRendezVous');

// CRUD pour MecaRendezVous

// Récupérer tous les MecaRendezVous
router.get('/', async (req, res) => {
  try {
    const items = await MecaRendezVous.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Créer un MecaRendezVous
router.post('/', async (req, res) => {
  const newItem = new MecaRendezVous(req.body);
  try {
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mettre à jour un MecaRendezVous
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await MecaRendezVous.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Supprimer un MecaRendezVous
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await MecaRendezVous.findByIdAndDelete(req.params.id);
    res.json(deletedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
