
const express = require('express');
const router = express.Router();
const Devis = require('../models/Devis');

// CRUD pour Devis

// Récupérer tous les Devis
router.get('/', async (req, res) => {
  try {
    const items = await Devis.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//get devis par id
router.get('/getDevis/:id', async (req, res) => {
  try {
    const items = await Devis.findById(req.params.id);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Créer un Devis
router.post('/', async (req, res) => {
  const newItem = new Devis(req.body);
  try {
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mettre à jour un Devis
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Devis.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Supprimer un Devis
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await Devis.findByIdAndDelete(req.params.id);
    res.json(deletedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


//get last
router.get('/last/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    // Récupérer le dernier devis de l'utilisateur
    const lastDevis = await Devis.findOne({ utilisateur: userId })
      .sort({ createdAt: -1 }) // Trier par date décroissante (du plus récent au plus ancien)
    if (!lastDevis) {
      return res.status(404).json({ message: "Aucun devis trouvé pour cet utilisateur." });
    }
    res.json(lastDevis);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/revenue', async (req, res) => {
  try {
    let { annee } = req.query;
 
    if (!annee || isNaN(annee)) {
      return res.status(400).json({ message: "Année invalide ou manquante" });
    }

    annee = parseInt(annee, 10); 

    const startOfYear = new Date(annee, 0, 1);
    const endOfYear = new Date(annee + 1, 0, 1); 

    const revenueByMonth = await Devis.aggregate([
      {
        $match: { createdAt: { $gte: startOfYear, $lt: endOfYear } } 
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalRevenue: { $sum: "$totalPrix" } 
        }
      },
      { $sort: { "_id": 1 } } 
    ]);

    // Générer un tableau de 12 mois avec 0 par défaut
    const monthlyRevenue = Array(12).fill(0);
    revenueByMonth.forEach(({ _id, totalRevenue }) => {
      monthlyRevenue[_id - 1] = totalRevenue; 
    });

    res.json(monthlyRevenue);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});








module.exports = router;
