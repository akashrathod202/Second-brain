import { z } from "zod";

 const deleteContentSchema = z.object({
    id: z
        .string()
        .min(1, "Content ID is required")
});


export default deleteContentSchema