const { remove } = require("../modelos/esquema");
const Anuncios = require("../modelos/esquema")

const removeFields=["limit","page"]






// Esta funcion es del tipo GET para listar todos anuncios.
// @access: public





exports.getAnuncios=async (req,res,next) => { 
    
    
    const {vende,descripcion, precio, tags, nombre, page = 1, limit = 2 } = req.query;
    console.log(req.query)
    try {
        const nanuncios = await Anuncios.find()
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
  
      // get total documents in the Posts collection 
      const count = await Anuncios.countDocuments();
  
      // return response with posts, total pages, and current page
     // console.log("prueba")
      
      res.json({
        nanuncios,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      });




        //let query;
    
        // Copy req.query
        //const reqQuery = {... req.query};
        
        // Fields to exclude
        //const removeFields = ['select']
    
        //
        //removeFields.forEach(param => delete reqQuery[param]);
    
        // Create a query String
        //let queryStr =JSON.stringify(reqQuery);
        //queryStr=queryStr.replace(/|b(gt|gte|lt|lte|in|)\b/g, match => `$${match}`)    
        //console.log(reqQuery)
    
        //query = Anuncios.find(JSON.parse(queryStr))
    
        //const page = parseInt(req.query.page, 10) || 1;
        //const limit = parseInt(req.query.limit,10) || 10;
        //const skip =(page-1)*limit;
    
        //query=query.skip(skip).limit(limit)
    
    //const anuncios = await Anuncios.find()

    //console.log(req.query.seleccionar)
    //res.status(200).json({sucsess:true, count: anuncios.length,data:anuncios})    
    
    } catch (error) {
    console.log(error)
        res.status(400).json({sucsess:false})
        console.error(err.message);
        
    }
    
}


// Esta funcion es del tipo GET para listar un sólo anuncio.
// @access: public




exports.getAnuncios2= async (req,res,next) => {
//let query;
//let queryStr = JSON.stringify(req.query)

//queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in|)\b/g, match => `$${match}`)  

//console.log(queryStr)

query = Anuncios.find({vende:req.query.vende})

//console.log(JSON.parse(queryStr))

const anuncio = await query

res.status(200).json({success: true, count: anuncio.length, data: anuncio})

}

exports.getAnuncios3 = async (req, res) => {
    try {
        //BUILD QUERY
        // 1A) Filtering
        const queryObj = { ...req.query }
        const excludedFields = ['page', 'sort', 'limit', 'fields']
        excludedFields.forEach(el => delete queryObj[el])
    
        //1B) Advanced filtering
        let queryString = JSON.stringify(queryObj)
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)    
        let query = Anuncios.find(JSON.parse(queryString))
    
        // 2) Sorting
        if (req.query.sort) {
          const sortBy = req.query.sort.split(',').join(' ')
          query = query.sort(sortBy)
        } else {
          query = query.sort('-createdAt')
        }
    
        //3) Field Limiting
        // Select pattern  .select("firstParam secondParam"), it will only show the selected field, add minus sign for excluding (include everything except the given params)
        if (req.query.fields) {
          const fields = req.query.fields.split(',').join(' ')
          query = query.select(fields)
        } else {
          query = query.select('-__v')
        }
    
        // 4) Pagination
        // page=2&limit=10, 1-10 page 1, 11-20 page 2, 21-30 page 3
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit;
    
        query = query.skip(skip).limit(limit);
    
        //EXECUTE QUERY
        const anuncios = await query
        
        /*res.status(200).json({
          status: 'success',
          results: anuncios.length,
          data: {
            anuncios
          }
        })*/
        res.render('listar', {
            anuncios: anuncios,
            tam: anuncios.length
          });
      } catch (error) {
        res.status(400).json({
          status: 'fail',
          message: error
        })
      }
    };


exports.getAnuncios1= async (req,res,next) => { 
    try {
        const anuncio = await Anuncios.findById(req.params.id);      
   //console.log("un Anuncio")
   if (!anuncio){
 return   res.status(400).json({success:false});
}

   

   res.status(200).json({sucsess:true, data:anuncio})
   
   
   

    } catch (error) {
        res.status(400).json({sucsess:false})  
        //console.error(err.message);  
    }
}


exports.updateAnuncio=async(req,res,next) => {
   try {
    const anuncio = await Anuncios.findByIdAndUpdate(req.params.id, req.body, {new:true,
        runValidators:true});
    
        if (!anuncio){
            return   res.status(400).json({success:false});
           }
           res.status(200).json({sucsess:true, data:anuncio})
        
    
   } catch (error) {
    res.status(400).json({sucsess:false})   
    
   }

   
    
}



// Esta funcion es del tipo GET para listar los tags.
// @access: public

exports.getTags= async (req,res,next) => { 
   
    const anuncio = await Anuncios.aggregate([
        {
            $group: {
                _id: null,
                tags: { $push: "$tags" }
                
            }
        },
        {
            $project: {
                tags: {
                    $reduce: {
                        input: "$tags",
                        initialValue: [],
                        in: { $setUnion: [ "$$value", "$$this" ] }
                    }
                }
               
            }
        }
    ])

    res.status(200).json({sucsess:true, data:anuncio})

}

exports.deleteAnuncio= async (req,res,next) => { 
    try {
        const anuncio = await Anuncios.findByIdAndDelete(req.params.id);      
   //console.log("un Anuncio")
   if (!anuncio){
 return   res.status(400).json({success:false});
}

   

   res.status(200).json({sucsess:true, data:{}})
       
    } catch (error) {
        res.status(400).json({sucsess:false})    
    }
}

// Esta funcion es del tipo POST para crear un nuevo anuncio.
// @access: public

exports.createAnuncios= async (req,res,next) => { 
try {
    
    const anuncio = await Anuncios.create(req.body);
    res.status(201).json({sucsess:true,data:anuncio})
   
} catch (error) {
    res.status(400).json({sucsess:false})
}

     
   


}