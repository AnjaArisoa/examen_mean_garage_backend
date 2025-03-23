const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path=require('path');
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
const routesPath = path.join(__dirname, 'routes');
fs.readdirSync(routesPath).forEach(file => {
  if (file.endsWith('.js')) {
    const routeName = `/${file.replace('.js', '')}`;
    app.use(routeName, require(path.join(routesPath, file)));
    console.log(`Route ${routeName} ajoutée`);
}
});

app.listen(PORT, () => console.log(`Serveur démarré sur le port
${PORT}`));