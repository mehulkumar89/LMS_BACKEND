import express from "express"
import { register,login,logout,getprofile,forgot,reset,changePassword,update} from "../controller/user_controller.js"
import {autharized} from "../middleware/user_middleware.js"
import upload from "../middleware/multer.js"
const router=express.Router()

router.post('/register',upload.single("avatar"),register)
router.post('/login',login)
router.get('/logout',logout)
router.get('/me/:id',getprofile)
router.post('/forgot-password',forgot)
router.post('/reset-password/:payload',reset)
router.post('/change-pass',autharized,changePassword)
router.put('/updateProfile/:id',autharized,upload.single("avatar"),update)

export default router
