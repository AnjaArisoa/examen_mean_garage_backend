
const express = require('express');
const router = express.Router();
const DetailPieces = require('../models/DetailPieces');
const Tache=require('../models/Tache')

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
async function getTachesCountThisMonth(annee, mois) {
  try {
    const startOfMonth = new Date(annee, mois - 1, 1); 
    const endOfMonth = new Date(annee, mois, 0); 
    const detailDevis = await DetailPieces.find({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    }).populate('tache'); 
    const tachesCount = {};
    detailDevis.forEach(detail => {
      const tacheId = detail.tache._id.toString(); 
      tachesCount[tacheId] = (tachesCount[tacheId] || 0) + 1; 
    });
    const taches = await Tache.find({
      '_id': { $in: Object.keys(tachesCount) }
    });
    const result = taches.map(tache => ({
      tache: tache.nom,
      count: tachesCount[tache._id.toString()] 
    }));

    return result;
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches :", error);
    throw error;
  }
}


router.get('/getTachePop', async (req, res) => {
  try {
    let { mois, annee } = req.query; 
    const items = await getTachesCountThisMonth(annee, mois);
    res.json(items); 
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;
