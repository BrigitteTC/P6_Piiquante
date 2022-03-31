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
/*
exports.createLike = (req, res, next) => {

    .then(() => {
        const userId = req.body.userId;
  const like = req.body.like
      //const like = sauce.like;
      //const disliked = sauce.disliked;
      //const sauceObject = JSON.parse(req.body.sauce);

      res
        .status(200)
        .json({ message: "retour du like " + userID + " like" + Number(like) });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
*/

/*
exports.createLike = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((data) => {
      const like = data.like;
      //const disliked = sauce.disliked;
      //const sauceObject = JSON.parse(req.body.sauce);

      res.status(200).json({ message: "retour du like " + req.params.body });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
*/
exports.createLike = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((data) => {
      res.status(200).json({ message: "retour du like " });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
