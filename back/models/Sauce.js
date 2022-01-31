const mongoose = require("mongoose");

// On utilise la méthode Schema de mongoose pour créer un shéma de données pour la base de donnée MongoDB
const SauceSchema = mongoose.Schema({
  userId: String,
  name: { type: String, maxLength: 128 },
  manufacturer: { type: String, maxLength: 128 },
  description: { type: String, maxLength: 256 },
  mainPepper: { type: String, maxLength: 128 },
  imageUrl: String,
  heat: Number,
  likes: Number,
  dislikes: Number,
  usersLiked: [String],
  usersDisliked: [String],
});

// La méthode model transforme le modèle au dessus en modèle utilisable par MongoDB
module.exports = mongoose.model("Sauces", SauceSchema);
