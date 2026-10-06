import { z } from "zod";

const createcontentSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(200, "Title cannot exceed 200 characters"),

    link: z
      .string()
      .min(1, "Content is required"),

    type: z
      .string()
      .min(1, "Type is required"),

    tags: z
      .array(z.string())
      .optional(),
  })
  .superRefine((data, ctx) => {
    // Only link and videos need URL validation
    if (data.type === "link" || data.type === "videos") {
      try {
        new URL(data.link);
      } catch {
        ctx.addIssue({
          code: "custom",
          path: ["link"],
          message: "Please provide a valid URL",
        });
      }
    }
  });

export default createcontentSchema;