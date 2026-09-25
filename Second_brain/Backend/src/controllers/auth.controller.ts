import { Request, Response } from "express";
import userModel from "../models/User"
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
 
dotenv.config();
const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
);




console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);

export const signup= async (req:Request, res:Response) => {
    try {
        const { name, password, email } = req.body;
        console.log("ok")
        console.log("REQ BODY:", req.body);

        if(!name || !email || !password){
            return res.status(400).json({
                message:"name ,email and password are required",
                status:"failed",
            });
        }

        const exist = await userModel.findOne({ email });

        if (exist) {
            return res.status(422).json({
                message: "User already exists with this email.",
                status: "failed",
            });
        }

        const user = await userModel.create({
            name,
            email,
            password,
        });

        const JWT_SECRET = process.env.JWT_SECRET as string;

        if (!JWT_SECRET) {
            return res.status(500).json({
                message: "JWT secret is not configured.",
                status: "failed",
            });
        }

        const token = jwt.sign(
          {
              id: user._id,
              email: user.email,
          },
          JWT_SECRET,
          {
              expiresIn: "1d",
          }
      );

      
        return res.status(201).json({
            message: "User created successfully.",
            status: "success",
            user:{
                _id:user._id,
                email:user.email,
               name:user.name
            },
            token:token
        });


         
 

    } catch (error) {
        console.error("SIGNUP ERROR:", error);
        return res.status(500).json({
            message: "Something went wrong.",
            status: "failed",
        });
    }
      
    }
 

export const signin= async(req:Request, res:Response) => {
    console.log("S ENDPOINT HIT")

    try{
    const {email,password}=req.body

    if(!email || !password){
        return res.status(400).json({
            message:"Email and password are required.",
            status:"failed"
        })
    }

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password.",
            status: "failed",
        });

    } 
    // console.log("SIGNIN SECRET:", process.env.JWT_SECRET);
    const JWT_SECRET = process.env.JWT_SECRET as string;

//     console.log("SERVER TIME:", new Date());
// console.log("SERVER TIMESTAMP:", Math.floor(Date.now() / 1000));


    const token = jwt.sign(
        {
            id: user._id,
            email: user.email
        },
        JWT_SECRET,    {
            expiresIn: "1d",
        }
    
    );

    console.log("TOKEN:", token);

const test = jwt.verify(token, JWT_SECRET);

console.log("VERIFY TEST:", test);
    

    console.log("NEW TOKEN CREATED:", token)
    return res.status(200).json({
        message: "Login successful.",
        status: "success",
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
        },
        token,
    });
    
}catch (error){
    console.log(" Signin Error",error)
   

    return res.status(500).json({
        message: "Something went wrong.",
        status: "failed",
    });
  }
}

export const getuser=async(req:Request,res:Response)=>{

    try{
        const  userId=req.userId

        
        

      
        const user= await  userModel.findById( 
             userId
        ) 

        console.log(user)
        if (!user){
            return res.status(400).json({
                message: "User not found",
            })
    
        
        }
         return res.status(200).json({
             user
         })
    }
    catch(error){
        console.log("Here is the error:", error);
        return res.status(500).json({
            message: "Internal server error",
          });
    }
}


export const googleLogin = async (req: Request, res: Response) => {
    try {
      console.log("🔥 GOOGLE LOGIN CONTROLLER HIT");
  
      const { credential } = req.body;
  
      console.log("Credential exists:", !!credential);
      console.log(
        "Backend Google Client ID:",
        process.env.GOOGLE_CLIENT_ID
      );
  
      if (!credential) {
        return res.status(400).json({
          message: "Google credential is required",
        });
      }
  
      console.log("1️⃣ Verifying Google token...");
  
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
  
      console.log("2️⃣ Google token verified");
  
      const payload = ticket.getPayload();
  
      console.log("3️⃣ Payload:", payload);
  
      if (!payload) {
        return res.status(400).json({
          message: "Invalid Google credential",
        });
      }
  
      const {
        sub: googleId,
        email,
        name,
        picture,
      } = payload;
  
      console.log("4️⃣ Google user:", {
        googleId,
        email,
        name,
        picture,
      });
  
      if (!email) {
        return res.status(400).json({
          message: "Google account email not available",
        });
      }
  
      console.log("5️⃣ Searching user...");
  
      let user = await userModel.findOne({ email });
  
      console.log("6️⃣ Existing user:", user);
  
      if (!user) {
        console.log("7️⃣ Creating Google user...");
  
        user = await userModel.create({
          name,
          email,
          googleId,
          profilePicture: picture,
          authProvider: "google",
        });
  
        console.log("8️⃣ User created:", user);
      } else {
        console.log("7️⃣ Updating existing user...");
  
        user.googleId = googleId;
        user.profilePicture = picture;
  
        await user.save();
  
        console.log("8️⃣ User updated");
      }
  
      console.log("9️⃣ Creating JWT...");
  
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
        },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "7d",
        }
      );
  
      console.log("🔟 JWT created");
  
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite:
          process.env.NODE_ENV === "production"
            ? "none"
            : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
  
      console.log("🍪 Cookie set");
  
      return res.status(200).json({
        message: "Google login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
        },
      });
  
    }  catch (error) {
      console.error("❌ GOOGLE LOGIN ERROR:", error);
  
      return res.status(500).json({
          message: "Google authentication failed",
          error: error instanceof Error
              ? error.message
              : String(error),
      });
  }
  };
 