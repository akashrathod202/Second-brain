import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
    id: string;
    email: string;
}

const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    // console.log("🔥🔥🔥 AUTH MIDDLEWARE STARTED 🔥🔥🔥");

    try {
        // 1. Get Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Authorization token is required.",
                status: "failed",
            });
        }

        // 2. Extract Bearer token
        const [scheme, token] = authHeader.split(" ");

        if (scheme !== "Bearer" || !token) {
            return res.status(401).json({
                message: "Invalid authorization format.",
                status: "failed",
            });
        }

        // 3. Get JWT secret
        const JWT_SECRET = process.env.JWT_SECRET as string;

        if (!JWT_SECRET) {
            return res.status(500).json({
                message: "JWT secret is not configured.",
                status: "failed",
            });
        }

        // 4. Verify token

        // console.log("TOKEN RECEIVED BY MIDDLEWARE:", token);
        // console.log("CURRENT SERVER TIME:", new Date());

 ;
        const decoded = jwt.verify(
            token,
            JWT_SECRET
        ) as JwtPayload;

        // 5. Store user ID in request
        console.log("DECODED TOKEN:", decoded);
        req.userId = decoded.id;

        // 6. Continue to endpoint
        next();

    } catch (error) {
        console.log("JWT ERROR:", error);

        return res.status(401).json({
            message: "Invalid or expired token.",
            status: "failed",
        });
    }
};

export default authMiddleware;