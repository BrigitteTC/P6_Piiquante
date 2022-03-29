/*
------------------------------------------
user.js
Date de création: 28/03/2022
auteur BTC

controleur pour les users
-----------------------------------------
*/

//package de cryptage
const bcrypt = require("bcrypt");

//controle des token
const jwt = require("jsonwebtoken");
//modele users
const User = require("../models/User");

// ft signup pour enregistrement de nouveaux utilisateurs
// avec hash du mot de passe

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(401).json({ error }));
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

//----------------------------------------------------------------------------

// ft login pour connecter les utilisateurs.
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "utilisateur inconnu" });
      }

      //bcrypt pour vérifier le mot de passe envoyé par l'utilisateur avec le hash enregistré
      //Si correct renvoi du TOKEN au frontend
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(402).json({ error: "Mot de passe incorrect" });
          }
          res.status(200).json({
            userId: user._id,
            //token signé avec clé secrete et qui expire dans 24h avec chaine alleatoire
            /*token: "TOKEN",*/

            token: jwt.sign(
              {
                userId: user._id,
              },
              "RANDOM_TOKEN_SECRET",
              { expiresIn: "24h" }
            ),
          });
        })
        .catch((error) => res.status(501).json({ error })); //500 = error serveur
    })
    .catch((error) => res.status(502).json({ error })); //500 = error serveur
};
