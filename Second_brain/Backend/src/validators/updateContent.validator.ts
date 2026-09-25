
import {z} from "zod"


  const updateContentSchema=z.object({
    title:z
        .string()
        .min(1,"Title is required")
        .max(200,"Title cannot exceed 200 characeter"),

    link:z
         .string()
         .url("please provide a valid URL"),

    type:z
          .string()
          .min(1,"Type is Required"),
    tags:z
          .array(z.string())
          .optional()
})

export default updateContentSchema