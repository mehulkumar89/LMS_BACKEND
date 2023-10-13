import mongoose from "mongoose";

mongoose.set("strictQuery",false)
const connectiondb= async()=>{
try{ 
 const {connection}= await mongoose.connect(
    process.env.CONN)
    if(connection){
        console.log(`connected to db:${connection.host}`)
    }
} 
catch(e){
    console.log(e)
    process.exit(1)
}
 
}

export default connectiondb