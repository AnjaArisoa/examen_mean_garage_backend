const fs = require('fs');
const path = require('path');
const inflection = require('inflection'); // Utilisé pour mettre les noms au pluriel
const modelsPath = path.join(__dirname, '../models'); // Le chemin vers ton dossier de modèles
const routesPath = path.join(__dirname, '../routes'); // Le chemin où tu veux générer les fichiers de routes

const modelFiles = fs.readdirSync(modelsPath);

// Fonction pour générer une route pour chaque modèle
modelFiles.forEach((file) => {
  if (file.endsWith('.js')) {
    const modelName = file.split('.')[0];
    const routeName = inflection.pluralize(modelName); // Le nom de la route au pluriel
    
    const routeFileContent = `
const express = require('express');
const router = express.Router();
const ${modelName} = require('../models/${modelName}');

// CRUD pour ${modelName}

// Récupérer tous les ${routeName}
router.get('/', async (req, res) => {
  try {
    const items = await ${modelName}.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Créer un ${modelName}
router.post('/', async (req, res) => {
  const newItem = new ${modelName}(req.body);
  try {
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mettre à jour un ${modelName}
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await ${modelName}.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Supprimer un ${modelName}
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await ${modelName}.findByIdAndDelete(req.params.id);
    res.json(deletedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
`;

    // Crée un fichier de route pour chaque modèle
    fs.writeFileSync(path.join(routesPath, `${routeName}.js`), routeFileContent);
  }
});

console.log('Routes générées avec succès');
