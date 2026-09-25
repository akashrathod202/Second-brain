import { model } from "mongoose"
import { lowercase, string } from "zod"
import { required } from "zod/mini"

const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: string,
        required: true,
        trim: true
    },
    email: {
        type: string,
        required: true,
        unique: true,
        trim: true,
        lowercase:true,


    },
    password: {
        type: string,
        required: false
    }
,

googleId: {
    type: String,
    unique: true,
    sparse: true,
  },


  profilePicture: {
    type: String,
  },

  authProvider: {
    type: String,
    enum: ["local", "google"],
    default: "local",
  },
},
{
    timestamps: true,
  }

)


const User = model("User", userSchema)
export default User;