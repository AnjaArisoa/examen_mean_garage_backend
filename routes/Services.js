
const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const upload = require("../middlewares/upload"); 

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

module.exports = router;
