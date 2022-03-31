//Piiquante

/*----------------------------------------
controllers/sauce.js
creation: 30/03/2022
auteur BTC

Controllers pour gérer les sauces
POST, PUT, GET et DELETE
-------------------------------------------
*/

const Sauce = require("../models/Sauce");
//const Like = require("../models/Like");

const fs = require("fs"); //acces à la gestion des fichiers de Node

/*-----------------------------------------------------------------------------------
Fonction: createSauce

Objet: création d'une sauce

verbe: POST

-------------------------------------------------------------------------------*/

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id; //on supprime l'ID de la sauce enregistrée
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`, // Url de l'image: protocole, nom du host: = server et Url de l'image
    likes: 0,
    dislikes: 0,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

/*-----------------------------------------------------------------------------------
Fonction: getOneSauce

Objet: récupération d'une seule sauce

verbe: GET

-------------------------------------------------------------------------------*/

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

/*-----------------------------------------------------------------------------------
Fonction: modifySauce

Objet: modification d'une sauce

Modification d'un objet = PUT
2 cas:
    1: L'utilisateur modifie les infos
    2: l'utilisateur modifie l'image = nouvelle image à traiter..

remarque:
    L'opérateur spread ... est utilisé pour faire une copie 
    de tous les éléments de req.body . 
-------------------------------------------------------------------------------*/
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file //Test si nouvelle image ou pas
    ? //1ier cas: nouvelle image on récupère son URL
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : //2ieme cas: pas de nouvelle image: copie du body
      { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

/*-----------------------------------------------------------------------------------
Fonction: deleteSauce

Objet: suppression d'une sauce

Suppression d'un objet = DELETE

DELETE avec suppression du dossier image
  vérifie si il y a une image à supprimer du dossier image
  et la supprime avec unlink
-------------------------------------------------------------------------------*/

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

/*-----------------------------------------------------------------------------------
Fonction: getAllSauce

Objet: chargement de toutes les sauces

verbe= GET
------------------------------------------------------*/

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
