//Piiquante

//----------------------------------------------------------------
// models/Like.js
// date de création: 30/03/3033
// auteur: BTC
//
// schemas de données pour les like
//
//-------------------------------------------

/*--------------------------------------------------------*/

//mongoose

const mongoose = require("mongoose");

//Creation schema pour les likes

const likeSchema = mongoose.Schema({
  userId: { type: String, required: true },
  like: { type: Number },
});

//export schemas

module.exports = mongoose.model("Like", likeSchema);
