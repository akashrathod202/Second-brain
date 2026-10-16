import { Router } from "express";

import {
    signup,
    signin,
    getuser,
    googleSignup,
    googleLogin 
} from "../controllers/auth.controller";

 

import { SignupSchema } from "../validators/auth.validator";
import SigninSchema from "../validators/auth.validator";
import {authLimiter } from '../middleware/rateLimit.middleware'
import validate from "../middleware/Validate.middleware";
import authMiddleware from "../middleware/auth.middleware";

const router = Router();

router.post(
    "/signup",
    authLimiter,
    validate(SignupSchema),
    signup
);

router.post("/google",
    googleLogin)

router.post("/google/signup",googleSignup)


router.post(
    "/signin",
    authLimiter,
    validate(SigninSchema),
    signin
);

router.get("/getuser",
    authMiddleware,
    authLimiter,
    getuser
)

export default router;