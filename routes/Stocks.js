
const express = require('express');
const router = express.Router();
const Stock = require('../models/Stock');
const Pieces = require('../models/Pieces');


// CRUD pour Stock

// Récupérer tous les Stocks
router.get('/', async (req, res) => {
  try {
    const items = await Stock.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/recherche-pieces-et-restant', async (req, res) => {
  try {
    // Extraction des paramètres de recherche
    const {
      nomPiece,
      reference,
      modeleVehicule,
      marqueVehicule,
      categorieVehicule,
      typeMoteur
    } = req.body;

    // Construction du pipeline d'agrégation
    const pipeline = [
      // Étape de jointure avec les collections référencées
      {
        $lookup: {
          from: 'categoriевehicules',
          localField: 'categorieVehicule',
          foreignField: '_id',
          as: 'categorieDetails'
        }
      },
      {
        $lookup: {
          from: 'modelevehicules',
          localField: 'modeleVehicule',
          foreignField: '_id',
          as: 'modeleDetails'
        }
      },
      {
        $lookup: {
          from: 'marquevehicules',
          localField: 'marqueVehicule',
          foreignField: '_id',
          as: 'marqueDetails'
        }
      },
      {
        $lookup: {
          from: 'stocks', 
          localField: '_id',
          foreignField: 'pieces',
          as: 'stockMovements'
        }
      },
      
      // Étape de filtrage
      {
        $match: {
          // Filtres dynamiques avec vérification d'existence
          ...(nomPiece && { nomPiece: { $regex: nomPiece, $options: 'i' } }),
          ...(reference && { reference: { $regex: reference, $options: 'i' } }),
          ...(modeleVehicule && { modeleVehicule: mongoose.Types.ObjectId(modeleVehicule) }),
          ...(marqueVehicule && { marqueVehicule: mongoose.Types.ObjectId(marqueVehicule) }),
          ...(categorieVehicule && { categorieVehicule: mongoose.Types.ObjectId(categorieVehicule) })
        }
      },
      
      // Calcul des totaux de stock
      {
        $addFields: {
          totalEntree: { $sum: '$stockMovements.entree' },
          totalSortie: { $sum: '$stockMovements.sortie' },
          stockDifference: { 
            $subtract: [
              { $sum: '$stockMovements.entree' }, 
              { $sum: '$stockMovements.sortie' }
            ] 
          }
        }
      },
      
      // Projection des résultats
      {
        $project: {
          _id: 1,
          nomPiece: 1,
          reference: 1,
          prix: 1,
          totalEntree: 1,
          totalSortie: 1,
          stockDifference: 1,
          categorieVehicule: 1,
          modeleVehicule: 1,
          marqueVehicule: 1,
          categorieDetails: { $arrayElemAt: ['$categorieDetails', 0] },
          modeleDetails: { $arrayElemAt: ['$modeleDetails', 0] },
          marqueDetails: { $arrayElemAt: ['$marqueDetails', 0] }
        }
      },
      
      // Tri par défaut
      { $sort: { nomPiece: 1 } }
    ];

    // Filtrage additionnel par type de moteur si spécifié
    if (typeMoteur) {
      pipeline.push({
        $match: {
          'modeleDetails.typeMoteur': typeMoteur
        }
      });
    }

    // Exécution de la requête d'agrégation
    const piecesStockSummary = await Pieces.aggregate(pipeline);

    // Réponse
    res.status(200).json({
      success: true,
      count: piecesStockSummary.length,
      data: piecesStockSummary
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du sommaire des stocks:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la recherche des stocks',
      error: error.message
    });
  }
});

// Créer un Stock
router.post('/', async (req, res) => {
  const newItem = new Stock(req.body);
  try {
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mettre à jour un Stock
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Supprimer un Stock
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await Stock.findByIdAndDelete(req.params.id);
    res.json(deletedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
