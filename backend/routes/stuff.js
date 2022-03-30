//Piiquante

/*-------------------------------------------------
routes/stuff.js
Date de création: 30 mars 2022
auteur: BTC

Création d'un routeur pour toutes les routes sauces
-------------------------------------------------
*/
const express = require("express");
const router = express.Router();

const stuffCtrl = require("../controllers/stuff");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

//auth dans chaque route permet de vérifier l'authentification et de la protéger

router.post("/", auth, multer, stuffCtrl.createSauce);
router.put("/:id", auth, multer, stuffCtrl.modifySauce);

router.get("/", auth, stuffCtrl.getAllStuff);
router.get("/:id", auth, stuffCtrl.getOneSauce);

router.delete("/:id", auth, stuffCtrl.deleteSauce);

//export du router
module.exports = router;
