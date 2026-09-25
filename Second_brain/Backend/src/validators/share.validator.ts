import { z } from "zod";

const shareSchema = z.object({
    share: z.boolean({
        message: "Share must be true or false"
    })
});

export default shareSchema