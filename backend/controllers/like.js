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

/*-----------------------------------------------------------------------------------
Fonction: createLike

Objet: gestion des like et dislike

verbe: POST

-------------------------------------------------------------------------------*/

exports.createLike = (req, res, next) => {
  //const likeObject = JSON.parse(req.body);
  const like = new Like({
    ...req.body,
  });

  const useId = like.id; //UserId qui a like la sauce
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
