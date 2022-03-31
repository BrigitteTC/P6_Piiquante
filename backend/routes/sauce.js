//Piiquante

/*-------------------------------------------------
routes/sauce.js
Date de création: 30 mars 2022
auteur: BTC

Création d'un routeur pour toutes les routes sauces
-------------------------------------------------
*/
const express = require("express");
const router = express.Router();

const sauceCtrl = require("../controllers/sauce");
const likeCtrl = require("../controllers/like");

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

//auth dans chaque route permet de vérifier l'authentification et de la protéger

router.post("/", auth, multer, sauceCtrl.createSauce);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);

router.get("/", auth, sauceCtrl.getAllSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);

router.delete("/:id", auth, sauceCtrl.deleteSauce);

//Route pour le like
router.post("/:id/like", auth, likeCtrl.createLike);

//export du router
module.exports = router;
