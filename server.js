// Este es el archivo principal para arrancar servidor y crear rutas.
path= require("path")
const jwt = require("jsonwebtoken")
const express = require('express');
const dotenv = require('dotenv');
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
app.use(express.json())
app.use(express.urlencoded({extended: false}))
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

// RUTA DE LOGIN

app.get("/login",(req,res,next) => { 
    res.send(`<html>
    <head>
        <title>Login</title>
    </head>
    <br>
        <form method="POST" action="api/authenticate">
        Nombre de Usuario: <input type="text" name="username"></br>
        Contraseña : <input type="password" name="password"></br>
        <input type="submit" value="Login">
        </form>
    </body>
    </html>`)
    
    })
    
/// RUTA PARA AUTENTIFICAR USUARIO
app.post("/api/authenticate", (req,res)=>{
console.log("Auth")
const {username,password}=req.body
console.log("username",username)
if(username=="user@example.com" && password=="1234" )
{
    
    console.log("Prueba")

    const user ={username:username}

    const accessToken = generateAccessToken(user)
    
    console.log(accessToken)
      
    res.header("authorization",accessToken).json(
        {mensaje: "Usuario Autenticado",
     accesstoken:accessToken}
    )

} else {

    res.header("authorization").json(
        {mensaje: "No Autorizado"
     })

}



})

// FUNCION PARA GENERAR TOKEM DE AUTENTIFIACION

function generateAccessToken(user){
return jwt.sign(user,process.env.SECRET,{expiresIn: '2h'})
}

// FUNCION PARA VALIDAR TOKEN

function validateToken(req,res,next){
  console.log("validateToken")
  
  //  const accesToken = window.localStorage.getItem('accessToken')
  const accessToken= req.headers["authorization"] ||  req.query.accesstoken
  console.log("Acess Token",accessToken)
  if(!accessToken) res.send("Access denied")
    jwt.verify(accessToken,process.env.SECRET, (err,user)=>{
        if(err){
            res.status(500)
            console.log("No Autorizado")
            res.send("Access denied, token expired or incorrect")
        }else{
            console.log("Siguiente")
           next() 
        }
    })
  

}

//RUTAS PROTEGIDAS
app.use("/api/",validateToken,rutas)




app.use(errorHandler)

/// Start Application Server
const PORT= process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));


/// Handle unhandle rejection

process.on('unhandledRejection',(err,promise) => {
console.log(`Error: ${err.message}`);
server.close(()=> process.exit(1))

})

