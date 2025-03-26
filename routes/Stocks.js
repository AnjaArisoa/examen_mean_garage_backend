
const express = require('express');
const router = express.Router();
const Stock = require('../models/Stock');
const Pieces = require('../models/Pieces');
const ReservationPieces =require("../models/ReservationPieces");
const DetailDevis =require("../models/DetailPieces");
const CategorieVehicule =require("../models/CategorieVehicule");
const ModeleVehicule =require("../models/ModeleVehicule");
const MarqueVehicule =require("../models/MarqueVehicule");
const TypeVehicule =require("../models/TypeVehicule");
const TypeMoteur =require("../models/TypeMoteur");


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
  const mongoose = require('mongoose');
  try {
    const {
      nomPiece,
      reference,
      modeleVehicule,
      marqueVehicule,
      categorieVehicule,  
    } = req.query;

    // Construire le filtre de recherche pour les pièces
    const filter = {
      ...(nomPiece && { nomPiece: { $regex: nomPiece, $options: 'i' } }),
      ...(reference && { reference: { $regex: reference, $options: 'i' } }),
      ...(modeleVehicule && { modeleVehicule: new mongoose.Types.ObjectId(modeleVehicule) }),
      ...(marqueVehicule && { marqueVehicule: new mongoose.Types.ObjectId(marqueVehicule) }),
      ...(categorieVehicule && { categorieVehicule: new mongoose.Types.ObjectId(categorieVehicule) })
    };

    // Récupérer les pièces
    const pieces = await Pieces.find(filter);

    // Récupérer les détails associés pour chaque pièce
    const piecesWithDetails = await Promise.all(
      pieces.map(async (piece) => {
        const categorieDetails = await CategorieVehicule.findById(piece.categorieVehicule);
        const typeVehiculeDetails = categorieDetails ? await TypeVehicule.findById(categorieDetails.typeVehicule) : null;
        const typeMoteurDetails = categorieDetails ? await TypeMoteur.findById(categorieDetails.typeMoteur) : null;
        const modeleDetails = await ModeleVehicule.findById(piece.modeleVehicule);
        const marqueDetails = await MarqueVehicule.findById(piece.marqueVehicule);
        
        // Récupérer les mouvements de stock
        const stockMovements = await Stock.find({ pieces: piece._id });
        const totalEntree = stockMovements.reduce((sum, stock) => sum + stock.entree, 0);
        const totalSortie = stockMovements.reduce((sum, stock) => sum + stock.sortie, 0);
        const stockDifference = totalEntree - totalSortie;

        return {
          ...piece.toObject(),
          totalEntree,
          totalSortie,
          stockDifference,
          categorieDetails,
          typeVehiculeDetails,
          typeMoteurDetails,
          modeleDetails,
          marqueDetails
        };
      })
    );

    res.status(200).json({
      success: true,
      count: piecesWithDetails.length,
      data: piecesWithDetails
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des pièces et du stock:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la recherche des stocks',
      error: error.message
    });
  }
});



async function checkResteStock(pieceId) {
  try {
    // Étape 1 : Calcul du stock disponible
    const stockData = await Stock.aggregate([
      { $match: { pieces: new mongoose.Types.ObjectId(pieceId) } }, // Filtrer par pièce
      {
        $group: {
          _id: "$pieces",
          totalEntree: { $sum: "$entree" },
          totalSortie: { $sum: "$sortie" }
        }
      },
      {
        $project: {
          stockDisponible: { $subtract: ["$totalEntree", "$totalSortie"] }
        }
      }
    ]);
    // Si aucune donnée dans Stock, stock disponible = 0
    const stockDisponible = stockData.length > 0 ? stockData[0].stockDisponible : 0;

    // Étape 2 : Calcul des réservations pour la même pièce
    const reservationData = await ReservationPieces.aggregate([
      { $match: { pieces: new mongoose.Types.ObjectId(pieceId) } }, // Filtrer par pièce
      {
        $group: {
          _id: "$pieces",
          totalReserve: { $sum: "$nombre" }
        }
      }
    ]);

    // Si aucune réservation, total réservé = 0
    const totalReserve = reservationData.length > 0 ? reservationData[0].totalReserve : 0;

    // Étape 3 : Comparaison
    console.log(`Stock disponible: ${stockDisponible}, Réservé: ${totalReserve}`);

    if (stockDisponible >= totalReserve) {
      return { success: true, message: "Stock suffisant " };
    } else {
      return { success: false, message: "Stock insuffisant" };
    }

  } catch (error) {
    console.error("Erreur lors du check du stock :", error);
    return { success: false, message: "Erreur lors du traitement" };
  }
};
async function createReservationAndCheckStock () {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
      // Étape 1 : Récupérer la dernière réservation
      const lastReservation = await ReservationPieces.findOne().sort({ createdAt: -1 }).session(session);
      if (!lastReservation) {
          throw new Error("Aucune réservation trouvée.");
      }

      const rdvId = lastReservation._rdv;

      // Étape 2 : Récupérer l'ID du devis à partir de la dernière réservation
      const devis = await DetailDevis.findOne({ devis: lastReservation.devis }).session(session);
      if (!devis) {
          throw new Error("Aucun devis trouvé pour cette réservation.");
      }

      const devisId = devis.devis;

      // Étape 3 : Récupérer les détails du devis
      const detailsDevis = await DetailDevis.find({ devis: devisId }).session(session);
      if (!detailsDevis.length) {
          throw new Error("Aucun détail de devis trouvé.");
      }

      let reservations = [];
      let stockInsuffisant = [];

      // Étape 4 : Boucler sur chaque détail du devis
      for (const detail of detailsDevis) {
          if (detail.pieces) { // Vérifier si la pièce est définie
              const stockData = await Stock.aggregate([
                  { $match: { pieces: detail.pieces } },
                  {
                      $group: {
                          _id: "$pieces",
                          totalEntree: { $sum: "$entree" },
                          totalSortie: { $sum: "$sortie" }
                      }
                  },
                  {
                      $project: {
                          stockDisponible: { $subtract: ["$totalEntree", "$totalSortie"] }
                      }
                  }
              ]).session(session);

              const stockDisponible = stockData.length > 0 ? stockData[0].stockDisponible : 0;

              if (stockDisponible < detail.nombrePieces) {
                  stockInsuffisant.push({
                      piece: detail.pieces,
                      stockDisponible,
                      demande: detail.nombrePieces
                  });
              } else {
                  // Ajouter une réservation si le stock est suffisant
                  reservations.push({
                      _rdv: rdvId,
                      pieces: detail.pieces,
                      nombre: detail.nombrePieces
                  });
              }
          }
      }

      if (stockInsuffisant.length > 0) {
          throw new Error("Stock insuffisant pour certaines pièces : " + JSON.stringify(stockInsuffisant));
      }

      // Étape 5 : Insérer les nouvelles réservations
      await ReservationPieces.insertMany(reservations, { session });

      // Valider la transaction
      await session.commitTransaction();
      session.endSession();

      return { success: true, message: "Réservations créées avec succès." };

  } catch (error) {
      await session.abortTransaction();
      session.endSession();
      return { success: false, message: error.message };
  }
}; 
router.get('/createReservationAndCheckStock', async (req, res) => {
  const {reservePieces}=require("./CommandePieces")
  try {
    await reservePieces(req.body);
    await createReservationAndCheckStock();
  } catch (error) {
    console.error('Erreur lors de la récupération du sommaire des stocks:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la recherche des stocks',
      error: error.message
    });
  }
});
async function addstock(data) {
  const newItem = new Stock(data);
    await newItem.save();
    return newItem;
}

// Créer un Stock
router.post('/', async (req, res) => {
  try {
    const newItem = await addstock(req.body);
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


