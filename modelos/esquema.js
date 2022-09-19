const mongoose = require("mongoose");

const esquemaAnuncios= new mongoose.Schema({
nombre:String ,


vende:String,

descripcion:String,
    

precio:Number,

tags: [String],

foto: String

/*
fechaCreacion: {type:Date,
    default: Date.now}
*/

});

module.exports = mongoose.model("Anuncios",esquemaAnuncios)
