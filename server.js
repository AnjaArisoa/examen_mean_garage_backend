const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
//maka zavatra ao anaty .env
const PORT = process.env.PORT || 5000;
// Middleware
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
useNewUrlParser: true,
useUnifiedTopology: true
}).then(() => console.log("MongoDB connecté"))
.catch(err => console.log(err));
//ajout routes
app.use('/articles', require('./routes/articleRoutes'));

app.listen(PORT, () => console.log(`Serveur démarré sur le port
${PORT}`));