
const express = require('express');
const router = express.Router();
const MecaRendezVous = require('../models/MecaRendezVous');

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

// Récupérer les détails d'un devis par son ID et joindre les taches et pièces
router.get('/listerendezvous/:idmeca', async (req, res) => {
  try {
    const { idmeca } = req.params;

    // Étape 1 : Trouver les rendez-vous de l'utilisateur donné
    const userAppointments = await MecaRendezVous.find({ _idUtilisateur: idmeca });

    if (!userAppointments || userAppointments.length === 0) {
      return res.status(404).json({ message: "Aucun rendez-vous trouvé pour cet utilisateur." });
    }

    // Étape 2 : Récupérer les IDs des rendez-vous associés à cet utilisateur
    const rendezvousIds = userAppointments.map(rdv => rdv._idrendezvous);

    // Étape 3 : Trouver tous les rendez-vous ayant les mêmes `_idrendezvous`
    const allAppointments = await MecaRendezVous.find({ _idrendezvous: { $in: rendezvousIds } })
    .populate({
        path: '_idrendezvous',
        populate: {
            path: '_idDevis',
            populate: [
                { path: 'modeleVehicule' }, // Charge le modèle du véhicule
                { 
                    path: 'categorieVehicule',
                    populate: ['typeVehicule', 'typeMoteur'] // Charge typeVehicule et typeMoteur depuis categorieVehicule
                }
            ]
        }
    })
    .populate('_idUtilisateur'); // Charge les utilisateurs
    // Étape 4 : Structurer la réponse pour regrouper les utilisateurs par rendez-vous
    const groupedAppointments = {};

    allAppointments.forEach(rdv => {
      const rdvId = rdv._idrendezvous._id.toString();

      if (!groupedAppointments[rdvId]) {
        groupedAppointments[rdvId] = {
          _id: rdv._id,
          _idrendezvous: rdv._idrendezvous,
          utilisateurs: []
        };
      }

      groupedAppointments[rdvId].utilisateurs.push(rdv._idUtilisateur);
    });

    // Convertir l'objet en tableau pour la réponse
    res.status(200).json(Object.values(groupedAppointments));

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});



module.exports = router;
