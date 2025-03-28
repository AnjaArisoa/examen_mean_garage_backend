
const express = require('express');
const router = express.Router();
const Pieces = require('../models/Pieces');
const CategorieVehicule = require('../models/CategorieVehicule');
const TachePieces = require('../models/TachePieces');
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

//pieces by categorie et modele
router.get('/getPieces', async (req, res) => {
  try {
      const { categorieVehicule, modeleVehicule } = req.query; // Récupérer les paramètres de la requête
      // Vérifier si les paramètres sont fournis
      if (!categorieVehicule || !modeleVehicule) {
          return res.status(400).json({ message: 'Categorie et modele sont requis.' });
      }

      // Rechercher les pièces qui correspondent à la catégorie et au modèle
      const pieces = await Pieces.find({
          categorieVehicule: new mongoose.Types.ObjectId(categorieVehicule),
          modeleVehicule: new mongoose.Types.ObjectId(modeleVehicule)
      });

      console.log("Pieces trouvées:", pieces); // Afficher les pièces trouvées

      // Si aucune pièce n'est trouvée, retourner un message approprié
      if (pieces.length === 0) {
          return res.status(404).json({ message: 'Aucune pièce trouvée pour cette catégorie et modèle.' });
      }

      res.json(pieces); // Retourner les pièces trouvées
  } catch (error) {
      console.error("Erreur lors de la récupération des pièces:", error.message); // Afficher l'erreur exacte
      res.status(500).json({ message: "Erreur lors de la récupération des pièces." });
  }
});

// Récupérer les pièces avec les tâches associées
router.get('/getPiecesAvecTache', async (req, res) => {
  try {
      const { categorieVehicule, modeleVehicule } = req.query;

      // Vérification des paramètres
      if (!categorieVehicule || !modeleVehicule) {
          return res.status(400).json({ message: 'Categorie et modele sont requis.' });
      }

      // Récupérer les pièces correspondant à la catégorie et au modèle
      const pieces = await Pieces.find({
          categorieVehicule: new mongoose.Types.ObjectId(categorieVehicule),
          modeleVehicule: new mongoose.Types.ObjectId(modeleVehicule)
      });

      if (pieces.length === 0) {
          return res.status(404).json({ message: 'Aucune pièce trouvée pour cette catégorie et modèle.' });
      }

      // Extraire les IDs des pièces trouvées
      const pieceIds = pieces.map(piece => piece._id);

      // Récupérer les TachePieces associées à ces pièces
      const tachePieces = await TachePieces.find({ pieces: { $in: pieceIds } })
          .populate('tache') // Charger les détails de la tâche
          .populate('pieces'); // Charger les détails des pièces

      if (tachePieces.length === 0) {
          return res.status(404).json({ message: 'Aucune tâche trouvée pour ces pièces.' });
      }

      res.json(tachePieces);
  } catch (error) {
      console.error("Erreur lors de la récupération des pièces et tâches:", error.message);
      res.status(500).json({ message: "Erreur interne du serveur." });
  }
});

// Récupérer les pièces associées à une tâche donnée
router.get('/getPiecesForTache', async (req, res) => {
  try {
      const { categorieVehicule, modeleVehicule, tacheId } = req.query;

      // Vérification des paramètres
      if (!categorieVehicule || !modeleVehicule || !tacheId) {
          return res.status(400).json({ message: 'Categorie, modele et tacheId sont requis.' });
      }
      // Récupérer les pièces correspondant à la catégorie et au modèle
      const pieces = await Pieces.find({
          categorieVehicule: new mongoose.Types.ObjectId(categorieVehicule),
          modeleVehicule: new mongoose.Types.ObjectId(modeleVehicule)
      });

      if (pieces.length === 0) {
          return res.status(404).json({ message: 'Aucune pièce trouvée pour cette catégorie et modèle.' });
      }

      // Extraire les IDs des pièces trouvées
      const pieceIds = pieces.map(piece => piece._id);

      // Récupérer les TachePieces associées à ces pièces et filtrer par tacheId
      const tachePieces = await TachePieces.find({
          pieces: { $in: pieceIds },
          tache: new mongoose.Types.ObjectId(tacheId)  // Filtrer par l'ID de la tâche
      })
      .populate('tache')  // Charger les détails de la tâche
      .populate('pieces'); // Charger les détails des pièces

      if (tachePieces.length === 0) {
          return res.status(404).json({ message: 'Aucune tâche trouvée pour ces pièces et cette tâche.' });
      }

      res.json(tachePieces);
  } catch (error) {
      console.error("Erreur lors de la récupération des pièces et tâches:", error.message);
      res.status(500).json({ message: "Erreur interne du serveur." });
  }
});



module.exports = router;
