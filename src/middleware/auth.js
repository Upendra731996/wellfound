const jwt =require('jsonwebtoken')

const authentication = async function(req,res,next){
   try {
    let token = req.headers["authorization"]
    console.log(token)
    if(!token) {return res.status(401).send({msg:"required token "}) }
   
    jwt.verify(token,"LetsEndore"
    ,(err,decoded)=>{
        if(err){
        return res
        .status(401)
        .send({ status: false, message:err.message });
    } else {
      

      req.decoded = decoded;
      next();
    }
    })
   } catch (error) {
    res.status(500).send({status:false,message:err.message})
   }
}



module.exports ={authentication}
