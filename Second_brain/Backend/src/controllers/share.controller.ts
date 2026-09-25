import { LinkModel } from "../models/Link";
import { Request,Response } from "express";
import { randomBytes } from "crypto";
import  ContentModel from "../models/Content";
import userModel from "../models/User";

 export const ShareLink=async (req:Request, res:Response) => {
    try {
        const share = req.body.share;
        console.log("share:", share);
        console.log("type:", typeof share);
        console.log("userId:", req.userId);



        if (typeof share !== "boolean"){
            return res.status(400).json({
                message:'share must be true or false',
            });
        }

        if (share === true) {

            const existingLink = await LinkModel.findOne({
                userId: req.userId
            });

            if (existingLink) {
                return res.status(200).json({
                    message: "Share link already exists",
                    hash: existingLink.hash
                });
            }

            const link = await LinkModel.create({
                userId: req.userId,
                hash: randomBytes(8).toString("hex")
            });

            return res.status(201).json({
                message: "Share link created",
                hash: link.hash
            });
        }

         if (share === false) {

            const deletedLink = await LinkModel.deleteOne({
                userId: req.userId
            });

            return res.status(200).json({
                message: "Sharing disabled successfully",
                status: "success"
            });
        }

        

    } catch (error) {
        console.log("SHARE ERROR:", error);

        return res.status(500).json({
            message: "Internal server error",
            status: "failed"

        });
    }
 }



 export const  GetLink=async (req:Request, res:Response) => {

try {
    // 1. Get hash from URL
    const hash = req.params.share;

    console.log("Share hash:", hash);

    


    // 2. Find the share link
    const link = await LinkModel.findOne({
        hash: hash
    });

    // 3. If share link doesn't exist
    if (!link) {
        return res.status(404).json({
            message: "Share link not found",
            status: "failed"
        });
    }

    console.log("Share link found:", link);

    // 4. Find all content belonging to this user
    const content = await ContentModel.find({
        userId: link.userId
    });

    // 5. Find the user
    const user = await userModel.findById(link.userId);

    // 6. User should exist if the link exists
    if (!user) {
        return res.status(404).json({
            message: "User not found",
            status: "failed"
        });
    }

    // 7. Send shared brain
    return res.status(200).json({
        message: "Shared brain fetched successfully",
        status: "success",
        username: user.username,
        content: content
    });

} catch (error) {
    console.error("SHARE GET ERROR:", error);

    return res.status(500).json({
        message: "Internal server error",
        status: "failed"
    });
}
 }