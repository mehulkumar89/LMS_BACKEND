import dotenv from "dotenv"
dotenv.config()
import express from "express"
import morgon from "morgan"
import cors from "cors"
import cookieParser from "cookie-parser"
import router from "./router/userRouter.js"
import courseRouter from "./router/coursRouter.js"
import paymentRouter from "./router/paymentRouter.js"
import errormiddleware from "./middleware/errormiddleware.js"
const app=express()
app.use(cors({
    origin:process.env.FRONTEND_URI,
    credentials:true,
}))
app.use(express.urlencoded({extended:true}))
app.use(morgon('dev'))
app.use(express.json())
app.use(cookieParser())
app.use('/api/v1/payments',paymentRouter)
app.use('/api/v1/course',courseRouter)
app.use('/api/v1/user',router)
app.use('*',(req,res)=>{
    res.status(400).send("!opps page not found")
})
app.use(errormiddleware)
export default app
