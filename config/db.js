const mongoose=require('mongoose')
require ('dotenv').config()

const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL),
        {
        useNewUrlParser:true,
        useUnifiedTopology:true
        }
        console.log("mongoDB connected");
        
    } catch (error) {
        console.log(error);
        
    }
}
module.exports=connectDB