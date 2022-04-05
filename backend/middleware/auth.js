//Piiquante

/*----------------------------------------
middleware/auth.js
Date de création: 29/03/2022
auteur: BTC

Gestion authentification des utilisateurs
pour protéger les routes sensibles


ATTENTION: pour DELETE et PUT
  Utilisation de req.auth pour authentifier l'utilisateur
  car la vérification du user envoyé par le body peut être falsifiée
  par une personne malveillante qui utiliserait POSTDAM par exemple pour envoyer une
  requete em mettant son propre userId comme propriétaire de la sauce.
------------------------------------------------*/

//configure dotenv pour les variables d'environnement
require("dotenv").config();

//jsonwebtoken pour vérifier les token

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    //on récupère le token dans le header = 2ieme elt du header apres le bearer
    const token = req.headers.authorization.split(" ")[1];
    const secretKey = process.env.SECRET_KEY;

    // on décode le token avec verify et clé secrete
    const decodedToken = jwt.verify(token, secretKey);
    const userId = decodedToken.userId;
    req.auth = { userId }; //attribue le userId à l'objet requete (clé et var du meme nom)

    // verif userId de la requete correspond à celui du token
    if (req.body.userId && req.body.userId !== userId) {
      throw "403: unauthorized request";
    } else {
      // tout va bien on peut passer la requete on passe à la suite

      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};
