/*----------------------------------------
middleware/auth.js
Date de création: 29/03/2022
auteur: BTC

Gestion authentification des utilisateurs
pour protéger les routes sensibles
------------------------------------------------*/
//jsonwebtoken pour vérifier les token

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    //on récupère le token dans le header = 2ieme elt du header apres le bearer
    const token = req.headers.authorization.split(" ")[1];

    // on décode le token avec verify et clé secrete
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;

    // verif userId de la requete correspond à celui du token
    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid user ID";
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
