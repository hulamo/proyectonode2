const express= require("express");
const { getAnuncios, getAnuncios1,getAnuncios2,getAnuncios3,createAnuncios,getTags,updateAnuncio , deleteAnuncio} = require("../controlador/anuncios");


const router=express.Router();

router.route("/listar").get(getAnuncios)

router.route("/crear").post(createAnuncios)
router.route("/tags").get(getTags)

router.route("/listar/:id").get(getAnuncios1);

router.route("/listar2/").get(getAnuncios2);

router.route("/listar3/").get(getAnuncios3);

router.route("/modificar/:id").put(updateAnuncio)

router.route("/borrar/:id").put(deleteAnuncio)

module.exports  =router;