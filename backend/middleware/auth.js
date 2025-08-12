const jwt=require("jsonwebtoken")

const verifiyToken=async(req,res,next)=>{
    let token=req.headers["authorization"]

    if(token){
        token=token.split(" ")[1]
        jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
            if(err){
                return res.status(401).json({message:"Invalid token"})
            }
            else{
       console.log(decoded)
       req.user=decoded
       next()
    }
        })
    }
    else{
        return res.status(401).json({message:"No token provided"})
    }
}
module.exports=verifiyToken