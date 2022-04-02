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

/*-----------------------------------------------------------------------
function: UpdateSauceLikeTab

Objet: Mise à jour 
    du nombre de like et dislike 
    et des tableaux des userId like
    et dislike de la sauce

Parametres:
  entrée: 
    userId: UserId du liker
    sauceId: Id de la sauce
    likeValue:  valeur du like: 
      1  0 et -1

Algo:
-----------------------------------------------------------------------*/
function UpdatesauceLikeTab(userId, sauceId, likeValue, res) {
  let sauce = new Sauce();
  try {
    let userLikeFound = false; //sera à true quand on aura trouvé un user dans le tableau des like
    let userDisLikeFound = false; //sera à true quand on aura trouvé un user dans le tableau des dislike

    //cherche sauce par son id
    Sauce.findOne({ _id: sauceId }).then((sauce) => {
      //update like
      console.log("Updatesauce Entree ft :nombre de like = " + sauce.likes);
      console.log(
        "Updatesauce Entree ft :nombre de dislike = " + sauce.dislikes
      );
      //boucle sur tableau des like
      for (user in sauce.usersLiked) {
        console.log("Updatesauce user" + user);
        if (user == userId) {
          userLikeFound = true;
        }
      }

      //boucle sur tableau des dislike
      for (user in sauce.usersDisliked) {
        console.log("Updatesauce  " + user);
        if (user == userId) {
          userDisLikeFound = true;
        }
      }

      if (likeValue == 1) {
        if (!userLikeFound) {
          // on l'ajoute à la fin du tableau des like
          sauce.usersLiked.push(userId);
          sauce.likes += 1;
        }
      }
      if (likeValue == -1) {
        if (!userDisLikeFound) {
          // on l'ajoute à la fin du tableau des dislike
          sauce.usersDisliked.push(userId);
          sauce.dislikes += 1;
        }
      }
    });

    //DEBUG

    console.log(
      "Updatesauce  Apres traitement:nombre de like = " + sauce.likes
    );
    console.log(
      "Updatesauce  Apres traitement:userId like = " + sauce.usersLiked[0]
    );

    console.log("Updatesauce  Apres:nombre de dislike = " + sauce.dislikes);
    console.log(
      "Updatesauce  Apres:userId dislike = " + sauce.usersDisliked[0]
    );
    //console.log("Updatesauce like length " + sauce.Liked.length);
    //console.log("Updatesauce dislike length " + sauce.Disliked.length);

    //mise à jour sauce
    Sauce.updateOne({ _id: sauceId }, sauce)

      .then(() => res.status(200).json({ message: "like pris en compte" }))
      .catch((error) => res.status(400).json({ error }));
  } catch (e) {
    console.log("UpdateSauceLikeTab " + e);
  }

  return sauce;
}

/*-----------------------------------------------------------------------------------
Fonction: createLike

Objet: gestion des like et dislike

verbe: POST

Algo:
  Acquisition de la requete like
  Pour chaque like:
    Récupération du userId
    Modif de la sauce pour mise à jour params des like ou dislike

-------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------
Fonction: createLike

Objet: gestion des like et dislike

verbe: POST

Algo:
  Acquisition de la requete like
  Pour chaque like:
    Récupération du userId
    Modif de la sauce pour mise à jour params des like ou dislike

-------------------------------------------------------------------------------*/

exports.createLike = (req, res, next) => {
  //const likeObject = JSON.parse(req.body);

  const sauceId = req.params.id; //Id de la sauce
  const likeValue = req.body.like; //compteur de like ou dislike
  const userId = req.body.userId; //Id du user qui a like la sauce

  let userLikeFound = false; //sera à true quand on aura trouvé un user dans le tableau des like
  let userDisLikeFound = false; //sera à true quand on aura trouvé un user dans le tableau des dislike

  //cherche sauce par son id
  Sauce.findOne({ _id: sauceId })
    .then((sauce) => {
      console.log("Updatesauce Entree ft :nombre de like = " + sauce.likes);
      console.log(
        "Updatesauce Entree ft :nombre de dislike = " + sauce.dislikes
      );
      //boucle sur tableau des like
      for (user in sauce.usersLiked) {
        console.log("Updatesauce user" + user);
        if (user == userId) {
          userLikeFound = true;
        }
      }

      //boucle sur tableau des dislike
      for (user in sauce.usersDisliked) {
        console.log("Updatesauce  " + user);
        if (user == userId) {
          userDisLikeFound = true;
        }
      }

      if (likeValue == 1) {
        if (!userLikeFound) {
          // on l'ajoute à la fin du tableau des like
          sauce.usersLiked.push(userId);
          sauce.likes += 1;
        }
      }
      if (likeValue == -1) {
        if (!userDisLikeFound) {
          // on l'ajoute à la fin du tableau des dislike
          sauce.usersDisliked.push(userId);
          sauce.dislikes += 1;
        }
      }

      if (likeValue == 0) {
        if (userDisLikeFound) {
          // on supprime le user du tableau

          let tabIndex = sauce.usersDisliked.indexOf(userId);
          if (tabIndex !== -1) {
            sauce.usersDisliked.splice(tabIndex, 1);
          }

          sauce.dislikes -= 1;
        }

        if (userLikeFound) {
          // on supprime le user du tableau
          let tabIndex = sauce.usersLiked.indexOf(userId);
          if (tabIndex !== -1) {
            sauce.usersLiked.splice(tabIndex, 1);
          }
          sauce.likes -= 1;
        }
      }

      //DEBUG

      console.log(
        "Updatesauce  Apres traitement:nombre de like = " + sauce.likes
      );
      console.log(
        "Updatesauce  Apres traitement:userId like = " + sauce.usersLiked[0]
      );

      console.log("Updatesauce  Apres:nombre de dislike = " + sauce.dislikes);
      console.log(
        "Updatesauce  Apres:userId dislike = " + sauce.usersDisliked[0]
      );

      Sauce.updateOne({ _id: sauceId }, sauce)

        .then(() => res.status(200).json({ message: "like pris en compte" }))
        .catch((error) => res.status(400).json({ error }));
    }) // fin du Sauce.findOne

    .catch((error) => res.status(400).json({ error }));
};

/*---------------------------------------------------------------------
ESSAIS






exports.createLike = (req, res, next) => {
  //const likeObject = JSON.parse(req.body);

  const sauceId = req.params.id; //Id de la sauce
  const likeValue = req.body.like; //compteur de like ou dislike
  const userId = req.body.userId; //Id du user qui a like la sauce

  console.log(req.params.like);
  console.log(req.params.id);

  console.log("----------------------------------------------");

  console.log("createLike req.body.like   = like = " + req.body.like);
  console.log("createLike req.body.userId  = userId xx=  " + req.body.userId);
  console.log("createLike req.params.id  = sauceId = " + req.params.id);

  //let newSauce = new Sauce();



      
      
    let userLikeFound = false; //sera à true quand on aura trouvé un user dans le tableau des like
    let userDisLikeFound = false; //sera à true quand on aura trouvé un user dans le tableau des dislike

    //cherche sauce par son id
    Sauce.findOne({ _id: sauceId }).then((sauce) => {
      //update like
      console.log("Updatesauce Entree ft :nombre de like = " + sauce.likes);
      console.log(
        "Updatesauce Entree ft :nombre de dislike = " + sauce.dislikes
      );
      //boucle sur tableau des like
      for (user in sauce.usersLiked) {
        console.log("Updatesauce user" + user);
        if (user == userId) {
          userLikeFound = true;
        }
      }

      //boucle sur tableau des dislike
      for (user in sauce.usersDisliked) {
        console.log("Updatesauce  " + user);
        if (user == userId) {
          userDisLikeFound = true;
        }
      }

      if (likeValue == 1) {
        if (!userLikeFound) {
          // on l'ajoute à la fin du tableau des like
          sauce.usersLiked.push(userId);
          sauce.likes += 1;
        }
      }
      if (likeValue == -1) {
        if (!userDisLikeFound) {
          // on l'ajoute à la fin du tableau des dislike
          sauce.usersDisliked.push(userId);
          sauce.dislikes += 1;
        }
      }
   

    //DEBUG

    console.log(
      "Updatesauce  Apres traitement:nombre de like = " + sauce.likes
    );
    console.log(
      "Updatesauce  Apres traitement:userId like = " + sauce.usersLiked[0]
    );

    console.log("Updatesauce  Apres:nombre de dislike = " + sauce.dislikes);
    console.log(
      "Updatesauce  Apres:userId dislike = " + sauce.usersDisliked[0]
    );


    //mise à jour sauce
    Sauce.updateOne({ _id: sauceId }, sauce)

      .then(() => res.status(200).json({ message: "like pris en compte" }))
      .catch((error) => res.status(400).json({ error }));
  }
.catch((error) => res.status(400).json({ error }));
};

//---------------------------------------------------------------------
// essais
/*
  if (Number(likeNum) == 0) {
    like
      .save()
      .then(() =>
        res.status(201).json({ message: "like ou dislike supprime !" })
      )
      .catch((error) => res.status(400).json({ error }));
  }

  if (Number(likeNum) == 1) {
    like
      .save()
      .then(() => {
        console.log("like");
        res.status(201).json({ message: "like ajouté !" });
      })

      .catch((error) => res.status(400).json({ error }));
  }

  if (Number(likeNum) == -1) {
    like
      .save()
      .then(() => res.status(201).json({ message: "dislike ajouté !" }))
      .catch((error) => res.status(400).json({ error }));
  }
};
*/
