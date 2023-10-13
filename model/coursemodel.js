import { Schema,model } from "mongoose";

const courseSchema= new Schema({
 title:{
    type:String,
    require:[true,'title is required'],
    minLength:[8,'tital must be atleast 8 charactures'],
    maxLength:[50,'title should be less then 60 charactures'],
    trim:true,
 },
 description:{
    type:String,
    require:[true,'description is required'],
    minLength:[8,'description must be atleast 8 charactures'],
    maxLength:[150,'description should be less then 150 charactures'],
 },
 category:{
    type:String,
    require:[true,'category is required'],
 },
 thumbnail:{
   public_id:String,
   secure_url:String
 },
 lectures:[
   {
  title:String,
  description:String,
  lecture:{
   public_id:{
      type:String,
   },
   secure_url:{
      type:String,
    }
  }
}
],
numberOfLectures:{
   type:Number,
   default:0,
   require:true,
},
createdBy:{
   type:String,
   require:true
}
},{
    timestamps:true
})

const course=model('course',courseSchema)

export default course