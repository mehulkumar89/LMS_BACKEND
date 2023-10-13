import { Schema,model } from "mongoose";
import Jwt  from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto"
const userSchema =new Schema({
  fullname:{
    type:String,
    required:[true,"all fields are required"],
    minLength:[5,"fullname must greater then 4"],
    maxLength:[20,"fullname must less then 21"],
    lowercase:true,
    trim:true,
  },
  email:{
   type:String,
   required:[true,"all fields are required"],
   lowercase:true,
   unique:true,
   trim:true,
   match:[/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi,'email must be in correct format']
  },
  password:{
    type:String,
    required:[true,"all fields are required"],
    select:false,
    minLength:[8,"password must be of 8 character"],
  },
  avatar:{
     public_id:{
      type:String
     },
     secure_url:{
      type:String
     }
  },
  role:{
  type:String,
  enam:['USER','ADMIN'],
  default:'USER'
  },
  forgotpasswordToken:String,
  forgotpasswordExpiry:Date,
  subscription:{
    id:String,
    status:String
  }
},{
  timestamps:true
})
userSchema.methods={
  jwtoken:function(){
     return Jwt.sign({id:this._id,email:this.email,subscription:this.subscription,role:this.role},
       process.env.SECRET,
       {expiresIn:'24h'}
      )
    },
    comparepass: async function(planetext){
       return await bcrypt.compare(planetext,this.password)
    },
    generatepasstoken: async function(){
      const resetToken=crypto.randomBytes(20).toString('hex')
      this.forgotpasswordToken=crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')
      this.forgotpasswordExpiry=Date.now()+ 15*60*1000 // 15 min from now
      return resetToken
    }
}
userSchema.pre('save',async function(next){
  if(!this.isModified('password')){
    next()
  }
  this.password=await bcrypt.hash(this.password,10);
  next()
})




const User= model('user',userSchema)
 
export default User