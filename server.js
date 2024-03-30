import app from "./app.js"
import connectiondb from "./config/dbconnection.js";
import cloudinary from "cloudinary"
import Razorpay from "razorpay"
const port=process.env.PORT
cloudinary.v2.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API,
    api_secret:process.env.CLOUD_API_SECRET
})
export const razorpay=new Razorpay({
    key_id:process.env.RAZOR_PAY_API,
    key_secret:process.env.RAZOR_PAY_SECRET
})
app.get('/', (req, res) => {
  res.send('Hello world!');
});
app.listen(process.env.PORT || 3000,async()=>{
    await connectiondb()
    console.log(`server is running on ${port}`);
})
