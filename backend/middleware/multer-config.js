//Piiquante

/*-----------------------------------------------------------------------------
middleware/multer-config.js
Date de création: 30/03/2022
Auteur: BTC

Gère les fichiers d'images  et permet leur téléchargement
--------------------------------------------------------------------------------
*/

const multer = require("multer");

/*
 constante dictionnaire de type MIME 
pour résoudre l'extension de fichier
en ft du dossier de stockage.
*/

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

/*----------------------------------------------------------------
fonction: storage

Objet: permet le stockage sur le disque

Paramètres:
  Entrée: 
      destination (fonction) indique à multer d'enregistrer les fichiers dans le dossier images
      filename (fonction) 
        fabrique le nom :nom d'origine + date + extention


---------------------------------------------------------------------*/
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    //1ier argument = la callback
    callback(null, "images"); // null: pas d'erreur  images= nom du dossier de stockage
  },

  //2ieme argument  : nom de fichier à utiliser
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_"); //nom d'origine avec blancs remplacé par "_"
    const extension = MIME_TYPES[file.mimetype]; //ajout de l'extension en ft du dossier
    callback(null, name + Date.now() + "." + extension); // appel callback : null : pas d'erreur,
    //nom + date+ extension
  },
});

//export du multer  avec methode .single = fichier unique
module.exports = multer({ storage: storage }).single("image");
