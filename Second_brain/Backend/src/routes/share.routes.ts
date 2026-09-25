import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware";
import  validate from "../middleware/Validate.middleware";
import { generalLimiter } from "../middleware/rateLimit.middleware";
import shareSchema  from "../validators/share.validator";

import {
    ShareLink,
    GetLink
} from "../controllers/share.controller";

const router = Router();
// console.log("shareSchema:", shareSchema);
router.post(
    "/share",
    authMiddleware,
    generalLimiter,
    validate(shareSchema),
    ShareLink
);

router.get(
    "/share",
    generalLimiter,
    authMiddleware,
    GetLink
);

export default router;