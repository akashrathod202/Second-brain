import ContentModel from "../models/Content"
import { Request,Response } from "express";


export const createContent = async (req: Request, res: Response) => {
    try {
        const { title, link, type,tags } = req.body;

        // Check required fields

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Title is required",
                status: "failed"
            });
        }

        if (!link || !link.trim()) {
            return res.status(400).json({
                message: "Content is required",
                status: "failed"
            });
        }

        if (!type) {
            return res.status(400).json({
                message: "Content type is required",
                status: "failed"
            });
        }

        

        // Create content
        const content = await ContentModel.create({
            title:title.trim(),
            link:link.trim(),
            type,
            tags:tags || [],
            userId: req.userId
        });

        return res.status(201).json({
            message: "Content created successfully",
            status: "success",
            content
        });

    } catch (error) {
        console.error('Create content Error',error);

        return res.status(500).json({
            message: error instanceof Error
            ? error.message
            : "Internal server error",
        status: "failed"
        });
    }
};


    export const getContent = async (req: Request, res: Response) => {
        try {
            const userId = req.userId;
            const {tag,search} =req.query
            // console.log("QUERY:", req.query);

            const filter:any={
                userId:userId
            }

            if(tag){
                filter.tags=String(tag).trim()
            }

            if(search){
                filter.title={
                    $regex:String(search).trim(),
                    $options:"i"

                }
            }

            // console.log("TAG:", tag);

            // console.log("FILTER:", filter);

            // const contentone=await ContentModel.find({
            //      userId: req.userId,
            //      tags: "javascript"
            // })

            // console.log("Tag test:",contentone)
            const content = await ContentModel.find(
                 filter
            ).populate("userId", "name");
    
            console.log( "content",content)
            if (content.length === 0) {
                return res.status(404).json({
                    message: "Content is not available",
                    status: "failed"
                });
            }
    
            return res.status(200).json({
                message: "Content fetched successfully",
                status: "success",
                content
            });
    
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
                status: "failed"
            });
        }
    };


    export const getOneContent = async (
        req: Request,
        res: Response
    ) => {
        try {
            const { contentId } = req.params;
    
            const content = await ContentModel.findOne({
                _id: contentId,
                userId: req.userId
            }).populate("userId", "name");
    
            if (!content) {
                return res.status(404).json({
                    message: "Content not found",
                    status: "failed"
                });
            }
    
            return res.status(200).json({
                message: "Content fetched successfully",
                status: "success",
                content
            });
    
        } catch (error) {
            console.error("Get one content error:", error);
    
            return res.status(500).json({
                message: "Internal server error",
                status: "failed"
            });
        }
    };



    export const updateContent = async (
        req: Request,
        res: Response
    ) => {
        try {
            // Get content ID from URL
            const { contentId } = req.params;
    
            // Get updated data from request body
            const { title, link, type } = req.body;
    
            // Check if at least one field is provided
            if (!title && !link && !type) {
                return res.status(400).json({
                    message: "Please provide at least one field to update",
                    status: "failed"
                });
            }
    
            // Find content belonging to logged-in user and update it
            const content = await ContentModel.findOneAndUpdate(
                {
                    _id: contentId,
                    userId: req.userId
                },
                {
                    ...(title !== undefined && { title }),
                    ...(link !== undefined && { link }),
                    ...(type !== undefined && { type })
                },
                {
                    new: true
                }
            );
    
            // Content doesn't exist or doesn't belong to user
            if (!content) {
                return res.status(404).json({
                    message: "Content not found or you are not authorized to update it",
                    status: "failed"
                });
            }
    
            // Success
            return res.status(200).json({
                message: "Content updated successfully",
                status: "success",
                content
            });
    
        } catch (error) {
            console.error("UPDATE CONTENT ERROR:", error);
    
            return res.status(500).json({
                message: "Internal server error",
                status: "failed"
            });
        }
    };
 export const deleteAllContent=async (req:Request,res:Response)=>{

     try{ 
  
        const result = await ContentModel.deleteMany({
         
          userId:req.userId
      });

      if(result.deletedCount === 0){
        return res.status(404).json({
            message:"content not found or you are not authorized to delete it",
            status:"failed" 
        });
    }

        res.json({
            message:" All Content deleted successfully",
            status:"success",
            deleteCount:result.deletedCount
        });
      
  
       
  }
  catch (error) {
    return res.status(500).json({
        message: "Internal server error",
        status: "failed"
    });
}
}


export const deleteContent=async (req:Request,res:Response)=>{

    try{ 
       const contentId=req.body.contentId;

       const result = await ContentModel.deleteOne({
        _id: contentId,
         userId:req.userId
     });

     if(result.deletedCount === 0){
       return res.status(404).json({
           message:"content not found or you are not authorized to delete it",
           status:"failed" 
       });
   }

       res.json({
           message:"Content deleted successfully",
           status:"success"
       });
     
 
      
 }
 catch (error) {
   return res.status(500).json({
       message: "Internal server error",
       status: "failed"
   });
}
}

   