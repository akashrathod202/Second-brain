import { model } from "mongoose"
 

const mongoose = require("mongoose")

const contentSchema=new mongoose.Schema({
       title: {
              type: String,
              required: true,
              trim: true,
       },
       link: {
              type: String,
               trim:true
       },
       type: {
              type: String,
              required: true,
              enum: ["link", "note", "youtube","video", "pdf", "code"]
          },
       tags:
              {
                type: [String],
                default: []
              },
       
       userId:{
              type:mongoose.Types.ObjectId,
              ref:"User",
              required:true,
              index:true
       }
       
     },

     {
       timestamps: true, 
  }
);
const ContentModel=model("content",contentSchema)
export default ContentModel;


 