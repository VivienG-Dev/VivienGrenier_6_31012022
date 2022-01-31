const multer = require('multer');

// Dictionnaire des fichiers autorisés par l'utilisateur.
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// On appel la méthode diskStorage de multer pour configurer le chemin et le nom de fichier pour les fichiers entrants
const storage = multer.diskStorage({
    // Pour indiquer à multer ou enregistrer les fichiers.
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  // Pour indiquer à multer quel nom de fichier utiliser pour éviter un doublon.
  filename: (req, file, callback) => {
    // On divise la chaîne de caractères en l'ajoutant dans un tableau et on replace le tout avec des underscores
    const originalName = file.originalname.split(' ').join('_');
    // On prend "originalName" et on enlève les 4 dernier caractères (sinon on retrouve un .jpg/.png dans la chaîne)
    const newName = originalName.substring(0, originalName.length-4);
    // Pour ajouter une des extentions autorisés
    const extension = MIME_TYPES[file.mimetype];
    // On fusionne le tout en ajoutant une timestamp
    callback(null, newName + Date.now() + '.' + extension);
  }
});

// On export le module et on lui passe l'objet storage et on appel la méthode single pour préciser qu'il s'agit d'un fichier unique (içi une "image")
module.exports = multer({ storage }).single('image');