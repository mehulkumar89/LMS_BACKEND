import AppError from "../util/error.js"
import sendEmail from "../util/sendemail.js"
import cloudinary from "cloudinary"
import user_model from "../model/user_model.js"
import fs from "fs/promises" 
import crypto from "crypto"
const register= async(req,res,next)=>{
  const {fullname,email,password}= req.body
  if(!fullname || !email || !password){
    return next(new AppError('ALL field is reqiured',400))
  }
  try{
    const user1=await user_model.findOne({email})
    if(user1){
      return next(new AppError('user already exist',400))
    }
       const user= await user_model.create({
        fullname,
        email,
        password,
        avatar:{
          public_id:email,
          secure_url:'https://res.cloudinary.com'
        }
      })
      if(!user){
        return next(new AppError('user registration failed',400))
      }
      //to do
      if(req.file){
        try{
           const result= await cloudinary.v2.uploader.upload(req.file.path,{
            folder:'lms',
            width:250,
            height:250,
            gravity:'faces',
            crop:'fill'
           })
           if(result){
            user.avatar.public_id=result.public_id
            user.avatar.secure_url=result.secure_url
            //remove file
            fs.rm(`upload/${req.file.filename}`)
          }

        }
        catch(e){
          return next(new AppError(e,400))
        }
      }

      await user.save()
      const optional={
        httpOnly: true,
        secure: true, 
        maxAge: 1000 * 60 * 60 * 24 * 7,  
        path: '/' ,sameSite:'none'
      }
      const token=user.jwtoken()
      user.password=undefined
      res.cookie("token",token,optional)
       res.status(200).json({
        success:true,
        message:"user register successfully"
       })
      }
      catch(e){
        return next(new AppError(e,400))
      }
  }

const login=async (req,res,next)=>{
const {password,email}=req.body
if(!password || !email){
  return next(new AppError('All fields are mandatory',400))
}
try{
const find=await user_model.findOne({email})
.select('+password')
if(!find){
  return next(new AppError('user not find',400))
}
if(!(await find.comparepass(password))){
  return next(new AppError('password not match!',400))
}
const optional={
  maxAge:24*60*60*1000,
  httpOnly:true,
  secure:true
}
const token=find.jwtoken()
res.cookie('token',token,optional)
find.password=undefined
res.status(200).json({
  success:true,
  user:find,
  message:'Login Successfully'
})
}
catch(e){
  return next(new AppError(e.message,400))
}
}

const logout =(req,res)=>{
   const optional={
    maxAge:0,
    httpOnly:true
   }
   try{
      res.cookie('token',null,optional)
      res.status(200).json({
        success:true,
        message:'logout succefully'
      })
   }
   catch(e){
    return next(new AppError(e.message,400))
   }
}

const getprofile= async(req,res)=>{
 const {id}=req.params
 try{
  const user=await user_model.findById(id)
  user.password=undefined
  res.status(200).json({
    success:true,
    data:user
  })
 }
 catch(e){
  return next(new AppError(e.message,400))
 }
}
const forgot= async(req,res,next)=>{
  const {email}=req.body
  if(!email){
    return next(new AppError('email is required',400))
  }
  const user=await user_model.findOne({email})
  if(!user){
    return next(new AppError('EMAIL NOT EXITS',400))
  } 
  const resetoken=await user.generatepasstoken()

  await user.save()
   const resetpassurl=`${process.env.FRONTEND_URI}/reset-password/${resetoken}`
   console.log(resetpassurl)
   const subject=`set password`
   const message=`YOUR MOBILE IS HACKED.<br> PLEASE<a href=${resetpassurl} target="_blank">RESET YOUR PASSWORD</a>`
   try{
    await sendEmail(email,subject,message)
    res.status(200).json({
      success:true,
      message:`Reset password token has been sent to ${email}`
    })
   }
   catch(e){
    user.forgotpasswordExpiry=undefined
    user.forgotpasswordToken=undefined
    return next(new AppError(e,400))
   }

}
const reset= async(req,res,next)=>{
   const {payload}=req.params

   const{password}=req.body
   if(!password){
    return next(new AppError('please provide password',400))
   }
   
   const forgotpasswordToken=crypto
   .createHash('sha256')
   .update(payload)
   .digest('hex')

   const user=await user_model.findOne({
    forgotpasswordToken,
    forgotpasswordExpiry:{ $gt: Date.now()}
   })
   if(!user){
    return next(new AppError('Token invalid or expires,please try again',400))
   }
   user.password=password
   user.save()
   user.forgotpasswordToken=undefined
   user.forgotpasswordExpiry=undefined
   res.status(200).json({
    success:true,
    message: 'password is reset successfully'
 })
   
}
const changePassword= async(req,res,next)=>{
        const {oldpass,newpass}=req.body
        const {id}=req.user
        if(!oldpass || !newpass){
          return next(new AppError('ALL FIELD REQUIRED',400))
        }
        const user= await user_model.findById(id).select('+password')
        if(!user){
          return next(new AppError('USERINVALID',400))
        }
        const isvalid= await user.comparepass(oldpass)
        if(!isvalid){
          return next(new AppError('password not match',400))
        }
        user.password=newpass
        await user.save()
        user.password=undefined
        res.status(200).json({
           success:true,
           message:'password changed successfully'
        })

}
const update= async(req,res,next)=>{
  const {fullname}=req.body
  const {id}=req.params
  const user= await user_model.findById(id)
  if(!user){
    return next(new AppError('invalid user',400))
  }
    if(fullname){
    user.fullname=fullname
    }
    if(req.file){
     await cloudinary.v2.uploader.destroy(user.avatar.public_id)
     try{
      const result= await cloudinary.v2.uploader.upload(req.file.path,{
       folder:'lms',
       width:250,
       height:250,
       gravity:'faces',
       crop:'fill'
      })
      if(result){
       user.avatar.public_id=result.public_id
       user.avatar.secure_url=result.secure_url
       //remove file
       fs.rm(`upload/${req.file.filename}`)
     }

   }
   catch(e){
     return next(new AppError(e,400))
   }
  }
  await user.save()
  res.status(200).json({
    success:true,
    message:'profile updated'
  })
}

export {
    register,
    login,
    logout,
    getprofile,
    forgot,
    reset,
    changePassword,
    update,
}



