import mongoose, { model } from "mongoose"

const LinkSchema=new mongoose.Schema({
hash:{
       type:String,
       required:true,
       unique:true
},
   userId:{
       type:mongoose.Types.ObjectId,
       ref:"User",
       required:true,
       unique:true
   },
  },
  {
       timestamps: true, 
  }
)
 
export const LinkModel=model("Link",LinkSchema);
 
