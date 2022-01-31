// bcrypt pour hasher le mot de passe de l'utilisateur
const bcrypt = require("bcrypt");
// jsonwebtoken permet d'attribuer un token à l'utilisateur au moment ou il se connecte
const jwt = require("jsonwebtoken");
// On récupère le modèle User
const User = require("../models/User");

// Pour sauvegarder un nouvel utilisateur avec un email et un mot de passe (en passant par bcrypt pour le hash)
exports.signup = (req, res) => {
  // On fait appel à la méthode hash de bcrypt, on lui passe le mot de passe de l'utilisateur en provenance du formulaire et on le "sale" 10 fois
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Pour se connecter à l'application
exports.login = (req, res) => {
  // L'utilisateur va rentrer un email et mot de passe
  User.findOne({ email: req.body.email })
    .then((user) => {
      // Si un aucun "user" ne correspond à l'email proposer par l'utilisateur on retourne une erreur 401
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      // Si l'email correspond à un "user" alors on compare le mdp proposé (qui sera encripté) par le mdp de la base de donnée
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          // S'il le mdp encripté n'est pas le même que le mdp de la base de donnée alors on retourne une erreur
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          // Si c'est valide, on retourne une réponse 200 contenant l'ID utilisateur et un token
          res.status(200).json({
            userId: user._id,
            // On encode un nouveau token (qui contient l'id utilisateur en tant que payload) avec la fonction sign()
            token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
              // L'utilisateur devra se reconnecter au bout de 24h
              expiresIn: "24h"
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
