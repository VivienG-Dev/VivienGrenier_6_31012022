// Importation des Packages (on utilise Express pour simplifier le déploiement de nos API)
const express = require("express");

// Importation de mongoose pour avoir accès à la base de données
const mongoose = require("mongoose");

// Importation de la route pour les sauces
const apiRoutes = require("./routes/api");

// Importation de la route pour les utilisateurs
const userRoutes = require('./routes/user');

// Pour permettre l'upload d'images et la manipulation de ces dernières
const path = require('path');

// Pour permettre de masquer les informations de connexion à la base de données (fichier .env)
require("dotenv/config");

// Pour permettre l'execution d'express
const app = express();

// Middlewares qu'on attribue pour gérer la requête POST venant de l'application front-end pour en extraire le corps JSON
app.use(express.json());

// Cross Origin Resource Sharing pour définir comment les serveurs et les navigateurs interagissent
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Va servir les routes dédiées aux sauces
app.use("/api/sauces", apiRoutes);

// Va servir les routes dédiées aux utilisateurs
app.use('/api/auth', userRoutes);

// Importation de la route "images" pour indiquer à Express qu'il faut gérer la ressource "images" de manière statique
app.use('/images', express.static(path.join(__dirname, 'images')));

// Connection à MongooseDB en utilisatant dotenv pour cacher les informations de connexion
mongoose
  .connect(process.env.DB_CONNECTION)
  .then(() => console.log("Connected to BD"))
  .catch(() => console.log("Connection failed"));

// On écoute un serveur (3000)
app.listen(3000, (err) => {
  if (err) console.log(err);
  console.log('Server listening on PORT 3000')
});
