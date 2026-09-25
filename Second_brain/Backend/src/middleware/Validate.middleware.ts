import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

const validate = (schema: ZodSchema) => {

    // console.log("VALIDATE CALLED WITH:", schema);

    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        // console.log("SCHEMA INSIDE MIDDLEWARE:", schema);

        const result = schema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: "Validation failed",
                status: "failed",
                errors: result.error.issues
            });
        }

        req.body = result.data;

        next();
    };
};

export default validate;