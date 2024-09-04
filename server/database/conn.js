import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();

export const connect=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("connected to mongodb")
    }
    catch(err){
        console.log("connection failed",err);
    }
    
}

