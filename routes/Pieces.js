
const express = require('express');
const router = express.Router();
const Pieces = require('../models/Pieces');
const CategorieVehicule = require('../models/CategorieVehicule');
const mongoose = require('mongoose');


// CRUD pour Pieces

// Récupérer tous les Pieces
router.get('/', async (req, res) => {
  try {
    const items = await Pieces.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/recherche-pieces', async (req, res) => {
  try {
    const { nomPiece, reference, modeleVehicule, marqueVehicule, typeVehicule, typeMoteur } = req.body;
    const criteria = {};

    if (nomPiece) {
      criteria.nomPiece = { $regex: nomPiece, $options: 'i' };
    }

    if (reference) {
      criteria.reference = { $regex: reference, $options: 'i' };
    }

    if (modeleVehicule) {
      criteria.modeleVehicule = new mongoose.Types.ObjectId(modeleVehicule);
    }

    if (marqueVehicule) {
      criteria.marqueVehicule = new mongoose.Types.ObjectId(marqueVehicule);
    }

    // Gestion du typeVehicule et typeMoteur
    if (typeVehicule || typeMoteur) {
      const categorieCriteria = {};
      
      if (typeVehicule) {
        categorieCriteria.typeVehicule = new mongoose.Types.ObjectId(typeVehicule);
      }
      
      if (typeMoteur) {
        categorieCriteria.typeMoteur = new mongoose.Types.ObjectId(typeMoteur);
      }
      const categories = await CategorieVehicule.find(categorieCriteria).select('_id');
      const categorieIds = categories.map(categorie => categorie._id);
      if (categorieIds.length > 0) {
        criteria.categorieVehicule = { $in: categorieIds };
      } else {
        return res.json([]); 
      }
    }
    const pieces = await Pieces.find(criteria)
      .populate('categorieVehicule')
      .populate('modeleVehicule')
      .populate('marqueVehicule')
      .exec();

    res.json(pieces);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Créer un Pieces
router.post('/', async (req, res) => {
  const newItem = new Pieces(req.body);
  try {
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mettre à jour un Pieces
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Pieces.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Supprimer un Pieces
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await Pieces.findByIdAndDelete(req.params.id);
    res.json(deletedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
