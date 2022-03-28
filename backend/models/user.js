/*-----------------------------------------------------------
user.js
Date de création: 28/03/2022
Auteur: BTC

Gestion des utilisateurs et de leurs mots de passe
------------------------------------------------------------
*/

//Imports util:
const mongoose = require("mongoose");

//Ajout validateur
const uniqueValidator = require("mongoose-unique-validator");

//schema utilisateur avec user et passwd
// le passwd sera crypté
//le mail sera unique: impossible que 2 utilisateur s'enregistrent avec la même adresse mail

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

//ajout plugin pour vérifier mail unique avec validateur.

//avec l'élément mongoose-unique-validator passé comme plug-in,
//s'assurera que deux utilisateurs ne puissent partager la même adresse e - mail.
userSchema.plugin(uniqueValidator);
//export du modele avec mongoose
module.exports = mongoose.model("User", userSchema);
