
const errormiddleware= (err,req,res,next)=>{
 err.message=err.message || 'Something went wrong'
 err.statusCode=err.statusCode|| 500
 return res.status(err.statusCode).json({
    success:false,
    message:err.message
 })
}
export default errormiddleware
