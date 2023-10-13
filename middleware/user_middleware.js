import jwt from "jsonwebtoken"
import AppError from "../util/error.js"
const autharized= (req,res,next)=>{
    const token= (req.cookies && req.cookies.token)|| null
    if(!token){
        return res.status(400).json({
            success:false,
            message:'user unautharized'
        })
    }
    try{
    const value=jwt.verify(token,process.env.SECRET)
    req.user=value
    next()
    }
    catch(e){
        return res.status(400).json({
            success:false,
            message:'token'
        })
    }
}
const isauthorized= (...roles)=> async(req,res,next)=>{
    const isroleauthorized=req.user.role
    if(!(roles.includes(isroleauthorized))){
    return next(new AppError('you are not autherized',400))
    }
  next()
}

export {
    autharized,
    isauthorized
}