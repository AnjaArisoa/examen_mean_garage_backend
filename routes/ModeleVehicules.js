
const express = require('express');
const router = express.Router();
const ModeleVehicule = require('../models/ModeleVehicule');

// CRUD pour ModeleVehicule

// Récupérer tous les ModeleVehicules
router.get('/', async (req, res) => {
  try {
    const items = await ModeleVehicule.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/:idCategorie', async (req, res) => {
  try {
    const items = await ModeleVehicule.find({categorieVehicule:req.params.idCategorie});
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Créer un ModeleVehicule
router.post('/', async (req, res) => {
  const newItem = new ModeleVehicule(req.body);
  try {
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mettre à jour un ModeleVehicule
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await ModeleVehicule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Supprimer un ModeleVehicule
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await ModeleVehicule.findByIdAndDelete(req.params.id);
    res.json(deletedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
