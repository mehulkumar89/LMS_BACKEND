import express from "express"
import {createCourse,getcources,courseUpdate,getlectures,courseDeletion,addlecturebyid,courselecturDel} from "../controller/coursecontroller.js"
import upload from "../middleware/multer.js"
import {autharized,isauthorized} from "../middleware/user_middleware.js"
const router=express.Router()

router.route('/')
 .post(autharized,isauthorized('ADMIN'),upload.single("thumbnail"),createCourse)
 .get(getcources)
router.route('/:id')
 .get(autharized,getlectures)
 .put(autharized,isauthorized('ADMIN'),courseUpdate) 
 .delete(autharized,isauthorized('ADMIN'),courseDeletion)
 .post(autharized,isauthorized('ADMIN'),upload.single("lecture"),addlecturebyid)
router.route('/:id/:index') 
 .delete(autharized,isauthorized('ADMIN'),courselecturDel)

 export default router