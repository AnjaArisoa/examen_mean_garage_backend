
const express = require('express');
const router = express.Router();
const RendezVous = require('../models/RendezVous');
const Stock = require('../models/Stock');
const ReservationPieces = require('../models/ReservationPieces');
const Mecarendezvous = require('../models/MecaRendezVous');
const Utilisateur = require('../models/Utilisateur');
const mongoose = require("mongoose");


// CRUD pour RendezVous

// Récupérer tous les RendezVous
router.get('/', async (req, res) => {
  try {
    const items = await RendezVous.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getMecaniciensForRdv(mecanicienId) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const rdvs = await RendezVous.find({
      daterdv: { $gte: today } 
    });

    if (rdvs.length === 0) {
      return { message: 'Aucun rendez-vous trouvé aujourd\'hui' };
    }
    const rdvIds = rdvs.map(rdv => rdv._id);
    const mecanicienRdv = await Mecarendezvous.find({
      _idrendezvous: { $in: rdvIds },
      _idUtilisateur: mecanicienId 
    });

    if (mecanicienRdv.length === 0) {
      return { message: 'Ce mécanicien n\'a aucun rendez-vous aujourd\'hui' };
    }
    const rdvsCommun = await Mecarendezvous.find({
      _idrendezvous: { $in: mecanicienRdv.map(mr => mr._idrendezvous) }
    }).populate('_idUtilisateur', 'nom prenom');

    return rdvsCommun;
  } catch (err) {
    console.error('Erreur lors de la récupération des mécaniciens :', err);
    return { error: 'Erreur serveur' };
  }
}

//prendre tous les rdv d'un mecanicien avec ceux qui travaille avec lui
router.get('/getByMeca/:userid', async (req, res) => {
  try {
    const items = await getMecaniciensForRdv(req.params.userid);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Fonction pour récupérer les mécaniciens disponibles à une date et heure précise
async function getAvailableMecaniciens(dateRdv, heureDebut, heureFin) {
  try {
    // Recherche des RDVs déjà existants pour la date et l'heure demandées
    const rdvsOccupes = await RendezVous.find({
      daterdv: dateRdv, 
      $or: [
        { heuredebut: { $lt: heureFin }, heurefin: { $gt: heureDebut } } 
      ]
    });

    // Si aucun RDV n'est occupé, tous les mécaniciens sont disponibles
    if (rdvsOccupes.length === 0) {
      const tousMecaniciens = await Utilisateur.find({ role: "mecanicien" });
      return tousMecaniciens; // Retourne tous les mécaniciens
    }

    // Sinon, récupérer les IDs des RDVs occupés pour trouver les mécaniciens affectés
    const rdvIds = rdvsOccupes.map(rdv => rdv._id);

    // Trouver les mécaniciens déjà occupés par ces RDVs
    const mecaniciensOccupes = await Mecarendezvous.find({
      _idrendezvous: { $in: rdvIds }
    }).distinct('_idUtilisateur');

    // Récupérer la liste de tous les mécaniciens
    const tousMecaniciens = await Utilisateur.find({ role: "mecanicien" });

    // Filtrer les mécaniciens qui ne sont pas occupés
    const mecaniciensDisponibles = tousMecaniciens.filter(meca => {
      // Comparaison directe des ObjectId
      return !mecaniciensOccupes.some(occupeId => occupeId.equals(meca._id));
    });
    return mecaniciensDisponibles; // Retourner les mécaniciens disponibles
  } catch (err) {
    console.error('Erreur lors de la récupération des mécaniciens disponibles :', err);
    return { error: 'Erreur serveur' };
  }
}


//check si a la date et heure le rdv et libre
async function checkDateetHeureDispo(dateRdv, heureDebut, heureFin){
  try {
    const rdvsOccupes = await RendezVous.find({
      daterdv: dateRdv, 
      $or: [
        { heuredebut: { $lt: heureFin }, heurefin: { $gt: heureDebut } } 
      ]
    });
    return rdvsOccupes;
  } catch (err) {
    console.error('Erreur lors de la récupération des mécaniciens disponibles :', err);
    return { error: 'Erreur serveur' };
  }
}
//prendre les meca dispo a une heure et date precise
router.get('/checkMecaDispo', async (req, res) => {
  try {
    const { dateRdv, heureDebut, heureFin } = req.query;
    if (!dateRdv || !heureDebut || !heureFin) {
      return res.status(400).json({ message: "Tous les paramètres sont requis : dateRdv, heureDebut, heureFin" });
    }
    const items = await getAvailableMecaniciens(dateRdv, heureDebut, heureFin);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function checkMecaEtHeureRDV(nbrMecaDispo, nbrDemande, dateRdv, heureDebut, heureFin) {
  try {
    const check = await checkDateetHeureDispo(dateRdv, heureDebut, heureFin);

    if (nbrMecaDispo >= nbrDemande ) {
      if(check===0){
        return { disponible: true, message: "Assez de mécaniciens disponibles." };
      }
      else{
        return { disponible: true, message: "Assez de mécaniciens disponibles." };
      }
    }
    // Sinon, on trouve les 3 premiers créneaux qui respectent la durée demandée
    const creneauxDisponibles = await findCreneauxDisponibles(dateRdv, heureDebut, heureFin, nbrDemande, 3);
    return { 
      disponible: false, 
      message: "Pas assez de mécaniciens, voici les créneaux disponibles.",
      creneau:creneauxDisponibles
    };

  } catch (err) {
    console.error("Erreur lors de la vérification des mécaniciens et créneaux:", err);
    return { error: "Erreur serveur" };
  }
}

// 🔹 Fonction pour trouver les 3 premiers créneaux où la durée et les mécaniciens sont respectés
async function findCreneauxDisponibles(dateRdv, heureDebut, heureFin, nbrDemande, maxJours = 7) {
  try {
    let date = new Date(dateRdv + "T00:00:00"); // Corrige le problème de fuseau horaire
    const dureeRdv = getTimeDifference(heureDebut, heureFin);
    const heureDebutJournee = "08:00";
    const heureFinJournee = "18:00";

    let creneauxPossibles = [];

    for (let i = 0; i < maxJours; i++) {  
      let heureActuelle = heureDebutJournee;
      //console.log(`🔍 Recherche des créneaux pour le ${date.toISOString().split("T")[0]}`);

      // Récupérer les RDVs existants pour ce jour (corrigé)
      const rdvsExistants = await RendezVous.find({
        daterdv: { 
          $gte: new Date(date.setHours(0, 0, 0, 0)), 
          $lt: new Date(date.setHours(23, 59, 59, 999)) 
        }
      });

      while (heureActuelle < heureFinJournee) {
        const heureFinCreneau = addMinutes(heureActuelle, dureeRdv);

        if (heureFinCreneau > heureFinJournee) break;

        // Vérifier si le créneau est occupé
        const conflit = rdvsExistants.some(rdv =>
          (heureActuelle >= rdv.heuredebut && heureActuelle < rdv.heurefin) ||
          (heureFinCreneau > rdv.heuredebut && heureFinCreneau <= rdv.heurefin)
        );

        if (!conflit) {
          // Vérifier les mécaniciens disponibles
          const mecaniciensDisponibles = await getAvailableMecaniciens(date, heureActuelle, heureFinCreneau);

          if (mecaniciensDisponibles.length >= nbrDemande) {
            creneauxPossibles.push({
              date: date.toISOString().split("T")[0],
              heureDebut: heureActuelle,
              heureFin: heureFinCreneau,
              mecaniciensDisponibles
            });

            // Retourner seulement après avoir trouvé 3 créneaux
            if (creneauxPossibles.length >= 3) return creneauxPossibles;
          }
        }

        heureActuelle = addMinutes(heureActuelle, 30); // Décalage de 30 minutes
      }

      // Passer au jour suivant
      date.setDate(date.getDate() + 1);
    }

    return creneauxPossibles;

  } catch (err) {
    console.error("Erreur lors de la recherche des créneaux:", err);
    return [];
  }
}


// 🔹 Fonction pour ajouter des minutes à une heure (format "HH:MM")
function addMinutes(heure, minutes) {
  const [h, m] = heure.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m);
  date.setMinutes(date.getMinutes() + minutes);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

// 🔹 Fonction pour calculer la durée entre 2 horaires (ex: "08:00" et "09:30" -> 90 minutes)
function getTimeDifference(heureDebut, heureFin) {
  const [h1, m1] = heureDebut.split(":").map(Number);
  const [h2, m2] = heureFin.split(":").map(Number);
  return (h2 * 60 + m2) - (h1 * 60 + m1);
}
//prendre tous les creneaux dispo
router.get('/checkMecaDispoetHeure', async (req, res) => {
  try {
    const { nbrMecaDispo, nbrDemande, dateRdv, heureDebut, heureFin } = req.query;
    if (!nbrMecaDispo || !nbrDemande || !dateRdv || !heureDebut || !heureFin) {
      return res.status(400).json({ error: "Tous les champs sont requis." });
    }
    const items = await checkMecaEtHeureRDV(nbrMecaDispo, nbrDemande, dateRdv, heureDebut, heureFin);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// 🔹 Vérifie le stock et réserve pieces si suffisant
async function checkAndReservePieces(idDevis, detailsDevis) {
  try {
    let stockInsuffisant = false;
    const piecesInsuffisantes = []; // Tableau pour stocker les pièces avec stock insuffisant
    
    // Vérifier le stock pour chaque pièce
    for (const piece of detailsDevis) {
      const { pieces, nombrePieces } = piece;
      const stockCheck = await checkResteStock(piece.pieces);     
      if (stockCheck.stockRestant < nombrePieces) {
        console.log(`Stock insuffisant pour la pièce ${pieces.pieces}`);
        piecesInsuffisantes.push({
          pieces: piece.pieces,
          stockRestant: stockCheck.stockRestant,
          nombreDemande: nombrePieces
        });
        stockInsuffisant = true;
      }
    }

    if (stockInsuffisant) {
      return {
        success: false,
        message: "Stock insuffisant pour une ou plusieurs pièces.",
        piecesInsuffisantes: piecesInsuffisantes
      };
    }

    // Si toutes les pièces sont en stock, on les insère dans ReservationPieces
    const reservations = detailsDevis.map(piece => ({
      devis: idDevis,
      pieces: new mongoose.Types.ObjectId(piece.pieces),
      nombre: piece.nombrePieces
    }));

    //await ReservationPieces.insertMany(reservations);

    return {
      success: true,
      message: "Toutes les pièces ont été réservées avec succès",
      reservation: reservations
    };

  } catch (error) {
    console.error("Erreur lors du traitement des réservations :", error);
    return { success: false, message: "Erreur serveur" };
  }
}

router.post('/checkMecaEtPieces', async (req, res) => {
  try {
    const { idDevis, detailsDevis } = req.body; // Récupérer les données du corps de la requête

    if (!idDevis || !detailsDevis) {
      return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    // Vérification de la structure de detailsDevis pour éviter d'autres erreurs
    //console.log("Détails devis reçu : ", detailsDevis);

    const items = await checkAndReservePieces(idDevis, detailsDevis);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 Vérifie le stock d'une pièce
async function checkResteStock(pieceId) {
  try {
    // Étape 1: Calculer le stock disponible en fonction des entrées et sorties
    const stockData = await Stock.aggregate([
      { $match: { pieces: new mongoose.Types.ObjectId(pieceId) } },
      {
        $group: {
          _id: "$pieces",
          totalEntree: { $sum: "$entree" },  // Somme des entrées
          totalSortie: { $sum: "$sortie" }   // Somme des sorties
        }
      },
      {
        $project: {
          stockDisponible: { $subtract: ["$totalEntree", "$totalSortie"] }  // Stock disponible = entrée - sortie
        }
      }
    ]);

    const stockDisponible = stockData.length > 0 ? stockData[0].stockDisponible : 0; // Si aucun stock trouvé, stockDisponible = 0

    // Étape 2: Calculer le total des réservations pour cette pièce
    const reservationData = await ReservationPieces.aggregate([
      { $match: { pieces: new mongoose.Types.ObjectId(pieceId) } },
      {
        $group: {
          _id: "$pieces",
          totalReserve: { $sum: "$nombre" } // Somme des réservations
        }
      }
    ]);

    const totalReserve = reservationData.length > 0 ? reservationData[0].totalReserve : 0; // Si aucune réservation, totalReserve = 0

    // Étape 3: Calculer la différence entre stock disponible et réservations
    const stockRestant = stockDisponible - totalReserve;

    return {
      success: true,
      stockDisponible,
      totalReserve,
      stockRestant
    };

  } catch (error) {
    console.error("Erreur lors du check du stock :", error);
    return { success: false, message: "Erreur lors du traitement" };
  }
}


// Créer un RendezVous
router.post('/', async (req, res) => {
  const newItem = new RendezVous(req.body);
  try {
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mettre à jour un RendezVous
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await RendezVous.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Supprimer un RendezVous
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await RendezVous.findByIdAndDelete(req.params.id);
    res.json(deletedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.get('/last/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    // Récupérer le dernier devis de l'utilisateur
    const lastDevis = await RendezVous.findOne({ _idUtilisateur: userId })
      .sort({ createdAt: -1 }) // Trier par date décroissante (du plus récent au plus ancien)
    if (!lastDevis) {
      return res.status(404).json({ message: "Aucun devis trouvé pour cet utilisateur." });
    }
    res.json(lastDevis);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Route pour obtenir les rendez-vous par utilisateur avec populate de l'ID Devis
router.get('/getRendezVousByUtilisateur/:utilisateurId', async (req, res) => {
  try {
    const { utilisateurId } = req.params;

    // Recherche des rendez-vous associés à l'utilisateur avec un populate sur _idDevis
    const rendezVous = await RendezVous.find({ "_idUtilisateur": utilisateurId });

    if (!rendezVous || rendezVous.length === 0) {
      return res.status(404).json({ message: "Aucun rendez-vous trouvé pour cet utilisateur." });
    }

    return res.status(200).json(rendezVous);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

module.exports = router;
