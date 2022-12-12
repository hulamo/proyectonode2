/// MANEJADOR DE ERRORES 

const errorHandler = (err,res,req,next) => {
    if (res.headersSent) {
        return next(err)
      }
      res.status(500)
      res.render('error', { error: err })
    //console.log(err.stack)
    console.log("Error", err)
    


}

module.exports = errorHandler;


