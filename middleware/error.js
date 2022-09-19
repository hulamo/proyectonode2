const errorHandler = (err,res,req,next) => {

    //console.log(err.stack)
    console.log("paso 1")
    res.status(500).json(
    
    {sucess:false,
    error: err.message}
)

}

module.exports = errorHandler;

