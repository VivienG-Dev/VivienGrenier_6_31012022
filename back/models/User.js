const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userShema = mongoose.Schema({
  // On utilise la valeur unique dans Email pour s'assurer que deux utilisateurs n'aient pas le même email
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Améliore les messages d'erreur lors de l'enregistrement des données unique
userShema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userShema);
