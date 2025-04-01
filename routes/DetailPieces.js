
const express = require('express');
const router = express.Router();
const DetailPieces = require('../models/DetailPieces');

// CRUD pour DetailPieces

// Récupérer tous les DetailPieces
router.get('/', async (req, res) => {
  try {
    const items = await DetailPieces.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Créer un DetailPieces
router.post('/', async (req, res) => {
  const newItem = new DetailPieces(req.body);
  try {
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mettre à jour un DetailPieces
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await DetailPieces.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Supprimer un DetailPieces
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await DetailPieces.findByIdAndDelete(req.params.id);
    res.json(deletedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.get('/getByDevis/:id', async (req, res) => {
  try {
    const items = await DetailPieces.find({ devis: req.params.id });
    if (items.length === 0) {
      return res.status(404).json({ message: "Aucun détail de devis trouvé pour ce devis" });
    }
    const totals = items.reduce((acc, item) => {
      acc.totalPrixTache += item.prixTache || 0;  
      acc.totalDureTache += item.dureTache || 0; 
      return acc;
    }, { totalPrixTache: 0, totalDureTache: 0 });
    res.json(totals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/getByDetailDevis/:id', async (req, res) => {
  try {
    const items = await DetailPieces.find({ devis: req.params.id }); // Récupère tous les documents où devis = id 
    res.json(items); // Renvoie la liste des items trouvés
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Récupérer les détails d'un devis par son ID et joindre les taches et pièces
router.get('/detaildevis/:devisId', async (req, res) => {
  try {
      const { devisId } = req.params;

      const details = await DetailPieces.find({ devis: devisId })
          .populate('tache')  // Jointure avec Tache
          .populate('pieces') // Jointure avec Pieces
          .populate('devis'); // Jointure avec devis

      if (!details || details.length === 0) {
          return res.status(404).json({ message: "Aucun détail trouvé pour ce devis." });
      }

      res.status(200).json(details);
  } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});
router.get('/getAllTacheAndPiece/:devisId', async (req, res) => {
  try {
    const { devisId } = req.params;

    const details = await DetailPieces.find({ devis: devisId, etat: 0 }) // Filtre sur l'état égal à 0
      .populate('tache')  
      .populate('pieces')
      .populate('devis'); 

    if (!details || details.length === 0) {
      return res.status(404).json({ message: "Aucun détail trouvé pour ce devis avec l'état 0." });
    }

    // Regrouper les pièces par tâche
    const groupedData = {};
    details.forEach(detail => {
      const tacheId = detail.tache._id.toString();
      
      if (!groupedData[tacheId]) {
        groupedData[tacheId] = {
          _id: detail._id,
          devis: detail.devis,
          tache: detail.tache,
          prixTache: detail.prixTache,
          dureTache: detail.dureTache,
          nombrePieces: detail.nombrePieces,
          createdAt: detail.createdAt,
          updatedAt: detail.updatedAt,
          pieces: [],
          etat: detail.etat
        };
      }
      groupedData[tacheId].pieces.push(detail.pieces);
    });
    res.status(200).json(Object.values(groupedData));
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});
router.get('/getAllTacheAndPieceEnCours/:devisId', async (req, res) => {
  try {
    const { devisId } = req.params;

    const details = await DetailPieces.find({ devis: devisId, etat: 1 }) // Filtre sur l'état égal à 0
      .populate('tache')  
      .populate('pieces')
      .populate('devis'); 

    if (!details || details.length === 0) {
      return res.status(404).json({ message: "Aucun détail trouvé pour ce devis avec l'état 0." });
    }

    // Regrouper les pièces par tâche
    const groupedData = {};
    details.forEach(detail => {
      const tacheId = detail.tache._id.toString();
      
      if (!groupedData[tacheId]) {
        groupedData[tacheId] = {
          _id: detail._id,
          devis: detail.devis,
          tache: detail.tache,
          prixTache: detail.prixTache,
          dureTache: detail.dureTache,
          nombrePieces: detail.nombrePieces,
          createdAt: detail.createdAt,
          updatedAt: detail.updatedAt,
          pieces: [],
          etat: detail.etat
        };
      }
      groupedData[tacheId].pieces.push(detail.pieces);
    });
    res.status(200).json(Object.values(groupedData));
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});
router.get('/getAllTacheAndPieceTerminer/:devisId', async (req, res) => {
  try {
    const { devisId } = req.params;

    const details = await DetailPieces.find({ devis: devisId, etat: 2 }) // Filtre sur l'état égal à 0
      .populate('tache')  
      .populate('pieces')
      .populate('devis'); 

    if (!details || details.length === 0) {
      return res.status(404).json({ message: "Aucun détail trouvé pour ce devis avec l'état 0." });
    }

    // Regrouper les pièces par tâche
    const groupedData = {};
    details.forEach(detail => {
      const tacheId = detail.tache._id.toString();
      
      if (!groupedData[tacheId]) {
        groupedData[tacheId] = {
          _id: detail._id,
          devis: detail.devis,
          tache: detail.tache,
          prixTache: detail.prixTache,
          dureTache: detail.dureTache,
          nombrePieces: detail.nombrePieces,
          createdAt: detail.createdAt,
          updatedAt: detail.updatedAt,
          pieces: [],
          etat: detail.etat
        };
      }
      groupedData[tacheId].pieces.push(detail.pieces);
    });
    res.status(200).json(Object.values(groupedData));
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});


router.put('/updatetache/:tacheId', async (req, res) => {
  try {
    const { tacheId } = req.params;
    const { etat } = req.body;  // Assure-toi que l'état est envoyé dans le corps de la requête

    const result = await DetailPieces.updateMany(
      { 'tache': tacheId },  // Chercher les détails avec le tacheId
      { $set: { etat: etat } }  // Met à jour l'état avec l'état passé depuis le client
    );

    if (result.modifiedCount > 0) {
      return res.status(200).json({ message: `L'état des détails de devis pour la tâche ${tacheId} a été mis à jour.` });
    } else {
      return res.status(404).json({ message: "Aucun détail de devis trouvé avec cette tâche." });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

router.get('/detailForRdv/:devisId', async (req, res) => {
  try {
      const { devisId } = req.params;
      
      const details = await DetailPieces.find({ devis: devisId });
      
      if (!details || details.length === 0) {
          return res.status(404).json({ message: "Aucun détail trouvé pour ce devis." });
      }
      
      // Regrouper les données par ID de tâche
      const groupedDetails = details.reduce((acc, detail) => {
          const { tache, pieces, ...rest } = detail.toObject();
          
          if (!acc[tache]) {
              acc[tache] = { ...rest, tache, pieces: [pieces] };
          } else {
              acc[tache].pieces.push(pieces);
          }
          
          return acc;
      }, {});
      
      res.status(200).json(Object.values(groupedDetails));
  } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});


module.exports = router;
