//Piiquante

/*----------------------------------------
middleware/auth.js
Date de création: 29/03/2022
auteur: BTC

Gestion authentification des utilisateurs
pour protéger les routes sensibles
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
