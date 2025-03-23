
const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// CRUD pour Service

// Récupérer tous les Services
router.get('/', async (req, res) => {
  try {
    const items = await Service.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route pour rechercher par nom et description
router.get('/recherche-service', async (req, res) => {
  try {
    const { search } = req.body; 
    const regex = new RegExp(search, 'i');
    const services = await Service.find({
      $or: [
        { nom: regex },       
        { description: regex } 
      ]
    });

    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Créer un Service
router.post('/', async (req, res) => {
  const newItem = new Service(req.body);
  try {
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mettre à jour un Service
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Supprimer un Service
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await Service.findByIdAndDelete(req.params.id);
    res.json(deletedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
