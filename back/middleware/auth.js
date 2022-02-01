const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // On extrait le token du header "Authorization" et on utilise split pour récupérer le token après le mot clé Bearer
    const token = req.headers.authorization.split(" ")[1];
    // On utilise la fonction verify pour décoder le token
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    // On extrait l'ID utilisateur du token (bien penser à décoder avant sinon...)
    const userId = decodedToken.userId;
    // Si la demande contient un ID utilisateur alors nous comparons à celui extrait du token
    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid user ID";
    } else {
      // Si tout fonctionne l'utilisateur est authentifié et on passe l'exécution avec la fonction next()
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};
