
const express = require('express');
const router = express.Router();
const Article = require('../models/Article');

// CRUD pour Article

// Récupérer tous les Articles
router.get('/', async (req, res) => {
  try {
    const items = await Article.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Créer un Article
router.post('/', async (req, res) => {
  const newItem = new Article(req.body);
  try {
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mettre à jour un Article
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Supprimer un Article
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await Article.findByIdAndDelete(req.params.id);
    res.json(deletedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
