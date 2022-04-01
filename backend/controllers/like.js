//Piiquante

/*----------------------------------------
controllers/sauce.js
creation: 30/03/2022
auteur BTC

Controllers pour gérer les sauces
POST, PUT, GET et DELETE
-------------------------------------------
*/

const Like = require("../models/Like");

const fs = require("fs"); //acces à la gestion des fichiers de Node

/*-----------------------------------------------------------------------
function: UpdateSauceLikeTab

Objet: Mise à jour 
    du nombre de like et dislike 
    et des tableaus des userId like
    et dislike de la sauce

Parametres:
  entrée: 
    userId: UserId du liker
    sauceId: Id de la sauce
    likeValue:  valeur du like: 
      1  0 et -1

Algo:
-----------------------------------------------------------------------*/
function UpdatesauceLikeTab(userId, sauceId, likeValue) {
  try {
  } catch (e) {
    console.log("UpdateSauceLikeTab " + e);
  }
}

/*-------------------------------------------------------------------------
function:  getIdFromUrl

Objet: récupère le Id à partir de l'URL

Paramètres:
  Entrée: Url
  Sortie: userId

Algo:
Url de la forme: /api/sauces/:id/like
ou
/api/sauces/:id

------------------------------------------------------------------*/
function getIdFromUrl(url) {
  var userId = 0;
  try {
  } catch (e) {
    console.log("getUserIdFromUrl " + e);
  }

  return userId;
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

exports.createLike = (req, res, next) => {
  //const likeObject = JSON.parse(req.body);
  const like = new Like({
    ...req.body,
  });

  const userId = like.id; //UserId qui a like la sauce
  const likeNum = like.like; //compteur de like ou dislike

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
      .then(() => res.status(201).json({ message: "like ajouté !" }))
      .catch((error) => res.status(400).json({ error }));
  }

  if (Number(likeNum) == -1) {
    like
      .save()
      .then(() => res.status(201).json({ message: "dislike ajouté !" }))
      .catch((error) => res.status(400).json({ error }));
  }
};

/*---------------------------------------------------------------------
Test des requetes like
exports.createLike = (req, res, next) => {
  delete req.body._id;
  const like = new Like({
    ...req.body,
  });
  like
    .save()
    .then(() => res.status(201).json({ message: "like enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

*/
