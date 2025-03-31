
const express = require('express');
const router = express.Router();
const MecaRendezVous = require('../models/MecaRendezVous');
const Utilisateur=require('../models/Utilisateur')

// CRUD pour MecaRendezVous

// Récupérer tous les MecaRendezVous
router.get('/', async (req, res) => {
  try {
    const items = await MecaRendezVous.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/nombreParMeca', async (req, res) => {
  try {
    let { mois, annee } = req.query;
    if (!mois || !annee || isNaN(mois) || isNaN(annee)) {
      return res.status(400).json({ message: "Mois et année invalides ou manquants" });
    }

    mois = parseInt(mois, 10) - 1;
    annee = parseInt(annee, 10);

    const startOfMonth = new Date(annee, mois, 1);
    const endOfMonth = new Date(annee, mois + 1, 1); 

    const mecaniciens = await Utilisateur.find({ role: 'mecanicien' }, { nom: 1 });

    if (mecaniciens.length === 0) {
      return res.json([]); 
    }

    const mecanicienIds = mecaniciens.map(meca => meca._id);
    const rdvCounts = await MecaRendezVous.aggregate([
      {
        $match: {
          _idUtilisateur: { $in: mecanicienIds },
          createdAt: { $gte: startOfMonth, $lt: endOfMonth }
        }
      },
      {
        $group: {
          _id: "$_idUtilisateur",
          totalRdv: { $sum: 1 } 
        }
      }
    ]);

    console.log("RDV Counts:", rdvCounts);

    // Associer les résultats avec les mécaniciens
    const result = mecaniciens.map(meca => {
      const stats = rdvCounts.find(rdv => String(rdv._id) === String(meca._id)) || { totalRdv: 0 };
      return {
        nom: meca.nom,
        totalRdv: stats.totalRdv
      };
    });

    res.json(result);
  } catch (err) {
    console.error("Erreur:", err);
    res.status(500).json({ message: err.message });
  }
});




// Créer un MecaRendezVous
router.post('/', async (req, res) => {
  const newItem = new MecaRendezVous(req.body);
  try {
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mettre à jour un MecaRendezVous
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await MecaRendezVous.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Supprimer un MecaRendezVous
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await MecaRendezVous.findByIdAndDelete(req.params.id);
    res.json(deletedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
