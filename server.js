// Este es el archivo principal para arrancar servidor y crear rutas.
path= require("path")

const express = require('express');
const dotenv = require('dotenv');
//const logger = require("./middleware/logger");
const morgan = require("morgan")

const connectDB = require("./config/dba")

const errorHandler = require("./middleware/error")



// load env vars

dotenv.config({path: "./config/config.env"});

// Connect to DB

connectDB();


// Especificar archivo de rutas Rutas

const rutas=require("./rutas/rutas");

// Express

const app= express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


/// Body parser
app.use(express.json())



if(process.env.NODE_ENV==="development") {
app.use(morgan("dev"));

}

app.use('/public', express.static(path.join(__dirname, "public")))

// Ruta para archivo PUG


app.get("/",(req,res,next) => {
res.status(200).render("listar");

})


app.use("/",rutas)

app.use(errorHandler)
/// Start Apllication Server
const PORT= process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

/// Handle unhandle rejection

process.on('unhandledRejection',(err,promise) => {
console.log(`Error: ${err.message}`);
server.close(()=> process.exit(1))

})

