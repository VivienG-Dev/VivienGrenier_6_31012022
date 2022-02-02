const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userShema = mongoose.Schema({
  // La valeur "unique: true" avec le plugin "uniqueValidator" s'assure que deux utilisateurs ne puissent partager la même adresse
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Améliore les messages d'erreur lors de l'enregistrement des données unique
userShema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userShema);
