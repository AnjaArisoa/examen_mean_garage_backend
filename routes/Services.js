
const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const upload = require("../middlewares/upload"); 
const Tache = require("../models/Tache");

// CRUD pour Service

// Récupérer tous les services
router.get("/", async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route pour rechercher par nom et description
router.get('/recherche-service', async (req, res) => {
  try {
    const { search } = req.body; 
    const regex = new RegExp(search, 'i');
    const services = await Service.find({
      $or: [
        { nom: regex },       
        { description: regex } 
      ]
    });

    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Créer un Service avec image
router.post("/", upload.single("img"), async (req, res) => {
  try {
    const { nom, description } = req.body;
    const imgUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const newService = new Service({ nom, description, img: imgUrl });
    await newService.save();

    res.status(201).json(newService);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mettre à jour un Service
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Supprimer un Service
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await Service.findByIdAndDelete(req.params.id);
    res.json(deletedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});




// Route pour récupérer les services avec leurs tâches associées
router.get("/services-taches", async (req, res) => {
  try {
    // Récupérer tous les services
    const services = await Service.find();

    // Pour chaque service, récupérer les tâches associées
    const servicesWithTaches = await Promise.all(
      services.map(async (service) => {
        const taches = await Tache.find({ _idService: service._id });
        return {
          ...service.toObject(),
          taches: taches.map((t) => ({
            id: t._id,
            name: t.nom,
            description: t.description,
            prix: t.prix,
            nombremeca: t.nombremeca,
            selected: false, // Par défaut non sélectionné
          })),
        };
      })
    );

    res.json(servicesWithTaches);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

module.exports = router;
