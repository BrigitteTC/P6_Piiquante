/*
------------------------------------------
user.js
Date de création: 27/03/2022
auteur BTC

controleur pour les users
-----------------------------------------
*/

//package de cryptage
const bcrypt = require("bcrypt");
//modele users
const User = require("../models/User");

// ft signup pour enregistrement de nouveaux utilisateurs

//hash du mot de passe
//10 tours pour créer un passwd sécurisé

exports.signup = (req, res, next) => {
  console.log("email= " + req.body.email);
  console.log("passwd= " + req.body.password);
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
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// ft login pour connecter les utilisateurs.
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "utilisateur inconnu" });
      }

      //bcrypt pour vérifier le mot de passe envoyé par l'utilisateur avec le hash enregistré
      //Si correct renvoi du TOKEN au frontrnd
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect" });
          }
          res.status(200).json({
            userId: user._id,
            token: "TOKEN",
          });
        })
        .catch((error) => res.status(500).json({ error })); //500 = error serveur
    })
    .catch((error) => res.status(500).json({ error })); //500 = error serveur
};
