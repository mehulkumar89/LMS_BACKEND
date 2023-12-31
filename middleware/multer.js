import path from "path"
import multer from "multer"

const upload=multer({
dest:"upload/",
limits:{fieldSize:50 * 1024 * 1024},//50 mb size max limit
storage:multer.diskStorage({
    destination:"upload",
    filename:(_req,file,cb)=>{
        cb(null,file.originalname)
    },
}),
fileFilter: (_req,file,cb)=>{
    let ext=path.extname(file.originalname)
    if(
        ext !==".jpg" &&
        ext !==".jpeg" &&
        ext !==".webg" &&
        ext !==".png" &&
        ext !==".mp4" 
    ){
        cb(new Error(`unsupported file type! ${ext}`),false)
        return
    }
    cb(null,true)
},
})

export default upload