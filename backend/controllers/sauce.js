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
  if (req.file) {
    delFile(req.params.id); //On supprime l'ancien fichier de l'image
  }
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

/*------------------------------------------------------------
Fonction: delFile

Objet: Supprimer le fichier de l'image de la sauce

Parametres: entrée: sauceId: Id de la sauce

Algo:
  Trouve la sauce
  Calcule le chemin du fichier
  Supprime le fichier de l'image
---------------------------------------------------------*/

function delFile(sauceId) {
  try {
    Sauce.findOne({ _id: sauceId })
      .then((sauce) => {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {});
      })
      .catch((error) => res.status(500).json({ error }));
  } catch {}
}

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

/*-----------------------------------------------------------------------------------
Fonction: createLike

Objet: gestion des like et dislike

verbe: POST

Algo:
  Acquisition de la requete like
  traitement selon valeur du like:

  Cas like:
    Ajout du like dans le tableau si le UserID n'existe pas déjà
      et incrémente le compteur
  Cas dislike
        Ajout du like dans le tableau si le UserID n'existe pas déjà
      et incrémente le compteur

  cas 0: suppression d'un like ou dislike
    REcherche le UserID dans les tableaux like et dislike
    SUpprime l'elt si trouvé
    décrémente le compteur correspondant


-------------------------------------------------------------------------------*/

exports.createLike = (req, res, next) => {
  //const likeObject = JSON.parse(req.body);

  const sauceId = req.params.id; //Id de la sauce
  const likeValue = req.body.like; //compteur de like ou dislike
  const userId = req.body.userId; //Id du user qui a like la sauce

  //cherche sauce par son id
  Sauce.findOne({ _id: sauceId })
    .then((sauce) => {
      console.log("-------------------------------------------");
      console.log("debut :nombre de like = " + sauce.likes);
      console.log("debut :nombre de dislike = " + sauce.dislikes);

      //index sur tableau des likes et dislikes
      let tabLikeIndex = sauce.usersLiked.indexOf(userId);
      let tabDisLikeIndex = sauce.usersDisliked.indexOf(userId);

      //Traitement selon le like recu
      switch (likeValue) {
        case 1: //like
          console.log("ajout d'un like");

          if (tabLikeIndex === -1) {
            // UserId absent du tableau on l'ajoute à la fin du tableau
            sauce.usersLiked.push(userId);
            sauce.likes += 1;
          }
          break;

        case -1: //Dislike
          console.log("ajout d'un dislike");

          if (tabDisLikeIndex === -1) {
            // UserId absent du tableau on l'ajoute à la fin du tableau
            sauce.usersDisliked.push(userId);
            sauce.dislikes += 1;
          }
          break;

        case 0: //annulation du like précédent
          console.log("suppression d'un like ou dislike");
          //Test tableau des like
          if (tabLikeIndex !== -1) {
            // user trouvé on supprime le user du tableau et on dec le nb
            console.log("user trouvé");

            sauce.usersLiked.splice(tabLikeIndex, 1);

            sauce.likes -= 1;
          }
          // test tableau des dislike
          else if (tabDisLikeIndex !== -1) {
            console.log("user trouvé");
            // user trouvé  on supprime le user du tableau et on dec le nb

            sauce.usersDisliked.splice(tabDisLikeIndex, 1);

            sauce.dislikes -= 1;
          }

          break;

        default: //autre pas d'action
      }

      //DEBUG

      console.log("Updatesauce  Apres traitement:nb de like = " + sauce.likes);
      console.log(
        "Updatesauce  Apres traitement:userId like = " + sauce.usersLiked[0]
      );

      console.log("Updatesauce  Apres:nb de dislike = " + sauce.dislikes);
      console.log(
        "Updatesauce  Apres:userId dislike = " + sauce.usersDisliked[0]
      );

      //mise à jour de la sauce avec ses likes
      Sauce.updateOne({ _id: sauceId }, sauce)

        .then(() => res.status(200).json({ message: "like pris en compte" }))
        .catch((error) => res.status(400).json({ error }));
    }) // fin du Sauce.findOne

    .catch((error) => res.status(400).json({ error }));
};
