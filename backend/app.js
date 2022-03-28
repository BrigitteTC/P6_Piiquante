//----------------------------------------------------------------
//app.js
// date de création: 28/03/3033
// auteur: BTC
//
// Appliction app.js pour placer l'applisation express
/*

express facilite le codage du server node.

Mongoose est un package qui facilite les interactions avec la base de données MongoDB. 
Il permet de :
    valider le format des données ;
    gérer les relations entre les documents ;
    communiquer directement avec la base de données pour la lecture et l'écriture des documents.
*/
//-------------------------------------------

// import de express
const express = require("Express");

//mongoose
const mongoose = require("mongoose");

//routes

// application
const app = express();

//connexion a mongoDB

const uri =
  "mongodb+srv://BTCUser1:BTCUser1Passwd@cluster0.wupp6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))

  .catch((error) => {
    console.error("error= " + error + "  Connexion à MongoDB échouée !");
  });

//Nouvelle version du middleware du 22 mars 2022

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

//export de la fonction pour qu'on puisse y acceder depuis les autres fichiers du projet
// dont le server node.
module.exports = app;
