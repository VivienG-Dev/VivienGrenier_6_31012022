const express = require("express");

// Création d'un routeur avec la méthode mise à disposition par Express
const router = express.Router();

// Importation du middleware pour sécuriser les routes
const auth = require("../middleware/auth");

// Importation du middleware pour la gestion des images
const multer = require("../middleware/multer-config");

// Importation du controller "sauce"
const sauceCrtl = require("../controllers/sauce");

// Récupérer toute les sauces
router.get("/", auth, sauceCrtl.getAllSauces);
// Route pour créer une sauce
router.post("/", auth, multer, sauceCrtl.createSauce);
// Route permettant de récupérer une sauce précise via son id
router.get("/:id", auth, sauceCrtl.getOneSauce);
// Route permettant de supprimer une sauce précise via son id
router.delete("/:id", auth, sauceCrtl.deleteOneSauce);
// Route permettant de modifier une sauce
router.put("/:id", auth, multer, sauceCrtl.updateOneSauce);
// Route permettant de férer les likes/dislikes d'une sauce
router.post("/:id/like", auth, multer, sauceCrtl.likeDislike);

module.exports = router;
