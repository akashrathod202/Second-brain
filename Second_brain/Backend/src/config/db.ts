import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()

const connectDB=async()=>{

    try{

        await mongoose.connect(process.env.MONGO_URI!);
        console.log("Mongodb connnected")

    }
    catch(error){

        console.log("Mongodb conncetion failed",error)
        process.exit(1);
    }

}

export default connectDB;