
const express = require('express');
const router = express.Router();
const CommandePieces = require('../models/CommandePieces');
const  Stock  = require('../models/Stock');
const ReservationPieces=require('../models/ReservationPieces')
// CRUD pour CommandePieces

// Récupérer tous les CommandePieces

router.get('/', async (req, res) => {
  try {
    const items = await CommandePieces.find({ nombre: { $gt: 0 } })
    .populate({
      path: 'pieces',
      populate: [
        { path: 'categorieVehicule', model: 'CategorieVehicule' },
        { path: 'modeleVehicule', model: 'ModeleVehicule' },
        { path: 'marqueVehicule', model: 'MarqueVehicule' }
      ]
    })
    .exec();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getcommandePieces(id) {
  try{
    const items=await CommandePieces.findById(id);
    return items;
  }
  catch (err) {
    throw new Error(err.message);
  }
}
router.get('/getCommandePiece_by_id/:id', async (req, res) => {
  try {
    const items = await getcommandePieces(req.params.id);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
async function addpiece(data){
  const newItem = new CommandePieces(data);
  await newItem.save();
    
}
// Créer un CommandePieces
router.post('/', async (req, res) => {
  try {
    const newItem = await addpiece(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// Mettre à jour un CommandePieces
async function updateCommandePieces(id, data) {
  try {
    return await CommandePieces.findByIdAndUpdate(id, data, { new: true });
  } catch (err) {
    throw new Error(err.message);
  }
}
async function getCommandebyid(id){
  try {
    return await CommandePieces.findById(id);
  } catch (err) {
    throw new Error(err.message);
  }
}
// Mettre à jour un CommandePieces
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await updateCommandePieces(req.params.id, req.body);
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/check_commande/:id',async(req,res) => {
  try {
    const { nombre } = req.body;
    const ancienNombre=await getCommandebyid(req.params.id)
    const verif=ancienNombre.nombre-nombre
    if (verif<0) {
      return res.status(404).json({ message: "Check commande invalid" });
    }
    
    const commande=await getcommandePieces(req.params.id);
    if (!commande) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }
    const data = {
      pieces: commande.pieces,
      entree: nombre
    };
    const data2={
      nombre:verif
    }
    const updatedItem = await updateCommandePieces(req.params.id, data2);
    const val=await new Stock(data);
    await val.save();
    res.json(val);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Supprimer un CommandePieces
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await CommandePieces.findByIdAndDelete(req.params.id);
    res.json(deletedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
async function reservePieces(data){
  const newItem = new ReservationPieces(data);
  await newItem.save();
}
async function reservationPiecesbyid(id){
  
    const deletedItem = await ReservationPieces.findById(id);
    return deletedItem;
    
};

module.exports = router;
