import { model,Schema } from "mongoose";

const paymentSchema=new Schema({
 razorpay_payment_id:{
    type:String,
 },
 razorpay_subscription:{
    type:String,
 },
 razorpay_signature:{
    type:String,
 }
},{
    timestamps:true
})

const payment=model('payment',paymentSchema)

export default payment