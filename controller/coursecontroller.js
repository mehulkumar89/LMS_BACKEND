import User from "../model/coursemodel.js"
import cloudinary from "cloudinary"
import AppError from "../util/error.js"
import fs from 'fs/promises'
const getcources = async(req,res,next)=>{
  try{
  const courses= await User.find({}).select('-lectures')

   res.status(200).json({
    success:true,
    message:'All course Display',
    courses
   })
  }
  catch(e){
    return next(new AppError(e,400))
  }
}

const getlectures= async(req,res,next)=>{
  try{
    const {id}=req.params
    const user=await User.findById(id)
    res.status(200).json({
      success:true,
      message:'Course lectures fetch successfully',
      courses: user.lectures
     })
  }
  catch(e){
    return next(new AppError(e,400))
  }

}
const createCourse= async(req,res,next)=>{
  const {title,description,category,createdBy}=req.body
  if(!title || !description || !category || !createdBy){
    return next(new AppError('ALL FIELDS REQUIRED',400))
  }
  try{
  const user= await User.create({
    title,
    description,
    category,
    createdBy,
    thumbnail:{
      public_id:'DUMMY',
      secure_url:'DUMMY',
    }
  })
  if(!user){
    return next(new AppError('NOT CREATED TRY AGAIN',400))
  }
  if(req.file){
    const result= await cloudinary.v2.uploader.upload(req.file.path,{
      folder:'lms'
    })
    if(result){
      user.thumbnail.public_id=result.public_id
      user.thumbnail.secure_url=result.secure_url
    }
    fs.rm(`upload/${req.file.filename}`)
  }
  await user.save()

  res.status(200).json({
     success:true,
     message:'Course created successfully',
     user
  })
}
catch(e){
  return next(new AppError(e,400))
 }
}
const courseUpdate= async(req,res,next)=>{
try{
   const{id}=req.params
   const check=await User.findById(id)
   if(!check){
    return next(new AppError('Course not exist!',400))
   }
   const user=await User.findByIdAndUpdate(
    id,
    {
      $set:req.body
    },
    {
      runValidators:true
    }
   )
   res.status(200).json({
    success:true,
    message:'updated successfully',
    user
   })
 }
 catch(e){
  return next(new AppError(e,400))
 }
}
const courselecturDel= async(req,res,next)=>{
  const {id,index}=req.params
  const indexof=Number(index)
  let array=[]
  try{
  let user=await User.findById(id)
  if(user){
    for(let i=0;i<user.lectures.length;i++){
      if(i!=indexof)
      array.push(user.lectures[i])
    }
    user.lectures=array
    user.numberOfLectures=array.length
    await user.save()
  }
  res.status(200).json({
    success:true,
    message:'COURSE DELETED'
  })
}
catch(e){
  return next(new AppError(e,400))
 }
}
const courseDeletion= async(req,res,next)=>{
     const {id}=req.params
     try{
       const user= await User.findById(id)
       if(!user){
        return next(new AppError('course with this not exits',400))
       }
       await User.findByIdAndDelete(id)
       res.status(200).json({
        success:true,
        message:'course deleted',
       })

     }
     catch(e){
      return next(new AppError(e,400))
     } 
}
const addlecturebyid =async(req,res,next)=>{
  const {title,description}= req.body
  const {id}=req.params
  if(!title || !description){
    return next(new AppError('ALL FIELDS REQUIRED',400))
  }
  const user= await User.findById(id)
  if(!user){
    return next(new AppError('Course not exist!',400))
  }
  const course={
    title,
    description,
    lecture:{},
  }
  if(req.file){
    const result= await cloudinary.v2.uploader.upload(req.file.path,{
      folder:'lms'
    })
    if(result){
      course.lecture.public_id=result.public_id
      course.lecture.secure_url=result.secure_url
    }
    fs.rm(`upload/${req.file.filename}`)
  }
  user.lectures.push(course)
  user.numberOfLectures=user.lectures.length
  await user.save()
  res.status(200).json({
    success:true,
    message:'Lecture succesfully added',
    user
  })
}

export {
  getcources,
  getlectures,
  createCourse,
  courseUpdate,
  courseDeletion,
  courselecturDel,
  addlecturebyid,
  
}