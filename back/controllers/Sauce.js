// Importation du schema des sauces
const Sauce = require("../models/Sauce");

// Importation du module "file system" de Node.js pour la modification et téléchargement des images
const fs = require("fs");

// Pour la création d'une nouvelle sauce
exports.createSauce = async (req, res, next) => {
  // Stockage des données envoyées par le front-end sous forme de form-data
  const sauceObject = JSON.parse(req.body.sauce);
  // Suppression de l'id généré par le front-end (on a déjà l'id crée par mongoDB)
  delete sauceObject._id;
  // Création d'une instance du modèle Sauce (../models/Sauce)
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });

  // On sauvegarde et on retourne la réponse au front-end et une erreur en cas de problème
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

// Affichage de toutes les sauces
exports.getAllSauces = async (req, res) => {
  // On trouve la liste complète des sauces de la base de donnée avec la méthode find()
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

// Affichage d'une sauce
exports.getOneSauce = async (req, res) => {
  // On trouve la sauce unique ayant le même _id que le paramètre de la requête
  Sauce.findById(req.params.id)
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error }));
};

// Suppression d'une sauce
exports.deleteOneSauce = async (req, res) => {
  Sauce.findById({ _id: req.params.id }).then((sauce) => {
    // On récupère l'url de l'image de la sauce et on la split pour garder le nom de l'image uniquement
    const filename = sauce.imageUrl.split("/images/")[1];
    // On fait appel à unlink pour supprimer le fichier image
    fs.unlink(`images/${filename}`, () => {
      // On supprime la sauce
      Sauce.deleteOne({ _id: req.params.id })
        .then(() => {
          res.status(200).json({
            message: "Objet supprimé !",
          });
        })
        .catch((error) => {
          res.status(400).json({
            error: error,
          });
        });
    });
  });
};

// Mise à jour d'une sauces
exports.updateOneSauce = async (req, res) => {
  // On regarde si req.file est vrai alors on traite la nouvelle image, sinon on traite l'objet entrant et on update
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  // On utilise le file system pour supprimer...
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.likeDislike = (req, res, next) => {
  // Pour la route READ = Ajout/suppression d'un like / dislike à une sauce
  // Like présent dans le body
  let like = req.body.like;
  // On prend le userID
  let userId = req.body.userId;
  // On prend l'id de la sauce
  let sauceId = req.params.id;

  // Si on clique sur like
  if (like === 1) {
    Sauce.updateOne(
      {
        _id: sauceId,
      },
      {
        // On utilise l'opérateur $push de mongodb pour ajouter "userId" dans le tableau "usersLiked"
        $push: {
          usersLiked: userId,
        },
        // On utilise l'opérateur $inc de mongodb pour incrémenter le compteur de 1
        $inc: {
          likes: +1,
        },
      }
    )
      .then(() =>
        res.status(200).json({
          message: `J'aime ajouté !`,
        })
      )
      .catch((error) =>
        res.status(400).json({
          error,
        })
      );
  }
  // Si on clique sur dislike
  if (like === -1) {
    Sauce.updateOne(
      {
        _id: sauceId,
      },
      {
        $push: {
          usersDisliked: userId,
        },
        $inc: {
          dislikes: +1,
        },
      }
    )
      .then(() =>
        res.status(200).json({
          message: "Dislike ajouté !",
        })
      )
      .catch((error) =>
        res.status(400).json({
          error,
        })
      );
  }
  // Si on clique sur annuler un like ou dislike
  if (like === 0) {
    Sauce.findOne({
      _id: sauceId,
    })
      .then((sauce) => {
        // Si l'id de l'utilisateur est dans le tableau "usersLiked" on annule un like
        if (sauce.usersLiked.includes(userId)) {
          Sauce.updateOne(
            {
              _id: sauceId,
            },
            {
              // On utilise l'opérateur $pull de mongodb pour supprimer "userId" du tableau "usersLiked"
              $pull: {
                usersLiked: userId,
              },
              $inc: {
                likes: -1,
              },
            }
          )
            .then(() =>
              res.status(200).json({
                message: "Like retiré !",
              })
            )
            .catch((error) =>
              res.status(400).json({
                error,
              })
            );
        }
        // Si l'id de l'utilisateur est dans le tableau "usersDisliked" on annule le dislike
        if (sauce.usersDisliked.includes(userId)) {
          Sauce.updateOne(
            {
              _id: sauceId,
            },
            {
              $pull: {
                usersDisliked: userId,
              },
              $inc: {
                dislikes: -1,
              },
            }
          )
            .then(() =>
              res.status(200).json({
                message: "Dislike retiré !",
              })
            )
            .catch((error) =>
              res.status(400).json({
                error,
              })
            );
        }
      })
      .catch((error) =>
        res.status(404).json({
          error,
        })
      );
  }
};
