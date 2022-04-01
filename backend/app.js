//Piiquante

//----------------------------------------------------------------
//app.js
// date de création: 28/03/3033
// auteur: BTC
//
// Appliction app.js pour placer l'applisation express
// se connecter à MongoDB
//-------------------------------------------

// import de express
// express facilite le codage du server node.
const express = require("Express");

//mongoose
// Mongoose est un package qui facilite les interactions avec la base de données MongoDB.
const mongoose = require("mongoose");

//routes
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

// Acces au path du server
const path = require("path");

// application
const app = express();

//configure dotenv pour les variables d'environnement
require("dotenv").config();

//connexion a mongoDB

const user = process.env.USER;
const passwd = process.env.USER_PASSWD;
const urlDB = process.env.URLDB;
const uri = "mongodb+srv://" + user + ":" + passwd + "@" + urlDB;

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB Piiquante réussie !"))

  .catch((error) => {
    console.error(
      "error= " + error + "  Connexion à MongoDB Piiquante échouée !"
    );
  });

//gestion des images:
/*indique à Express qu'il faut gérer la ressource images de manière statique 
(un sous-répertoire de notre répertoire de base, __dirname ) 
à chaque fois qu'elle reçoit une requête vers la route /images . 
*/

app.use("/images", express.static(path.join(__dirname, "images")));

// ajout du middleware général
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//Utilisation de EXPRESS:
//Ajout use express.json pour capturer les objets json

app.use(express.json());

//app.use pour enregistrer les routes

//Route pour les sauces:
app.use("/api/sauces", sauceRoutes);

///api/auth = route attendue par le front end pour authentification
app.use("/api/auth", userRoutes);

//export de la fonction pour qu'on puisse y acceder depuis les autres fichiers du projet
// dont le server node.
module.exports = app;
