//-------------------------------------------------------
//server.js
//
// creation: 28/03/2022
// auteur: btc
//
// creation d'un serveur
//------------------------------------------------------

//importe le package http qui permet de créer le serveur
//const http = require("http"); //importe le package http
//const app = require("./app"); //apporte le app.js

const http = require("http");

const app = require("./app");

//fonction normalizePort renvoie un port valide, qu'il soit fourni sous
//la forme d'un numéro ou d'une chaîne;
const normalizePort = (val) => {
  try {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
      return val;
    }
    if (port >= 0) {
      return port;
    }
    return false;
  } catch {
    res.status(500).json({
      error: new Error("Erreur server"),
    });
  }
};
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

//la fonction errorHandler  recherche les différentes erreurs
//et les gère de manière appropriée.Elle est ensuite enregistrée dans le serveur;

const errorHandler = (error) => {
  try {
    if (error.syscall !== "listen") {
      throw error;
    }
    const address = server.address();
    const bind =
      typeof address === "string" ? "pipe " + address : "port: " + port;
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges.");
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(bind + " is already in use.");
        process.exit(1);
        break;
      default:
        throw error;
    }
  } catch {
    res.status(500).json({
      error: new Error("Erreur server"),
    });
  }
};

const server = http.createServer(app);

server.on("error", errorHandler);

//un écouteur d'évènements est également enregistré,
//consignant le port ou le canal nommé sur lequel le serveur s'exécute dans la console.

server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

server.listen(port);
