import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware";
import  createcontentSchema from "../validators/content.validator" 
import updateContentSchema from "../validators/updateContent.validator"
import validate from "../middleware/Validate.middleware"
import deleteContentSchema from "../validators/deleteContent.validator"
import { generalLimiter } from "../middleware/rateLimit.middleware";

import {
    createContent,
    getContent,
    deleteContent,
    deleteAllContent,
    getOneContent,
    updateContent,
} from "../controllers/content.controller";

const router = Router();


 
// TEST
router.get("/test", (req, res) => {
    res.json({
        message: "Content routes are working"
    });
});


// CREATE
router.post(
    "/createContent",
    authMiddleware,
    generalLimiter,
    validate(createcontentSchema),
    createContent
);


// GET ALL
router.get(
    "/getContent",
    generalLimiter,
    authMiddleware,
    getContent
);


// GET ONE
router.get(
    "/getOneContent/:contentId",
    generalLimiter,
    authMiddleware,
    getOneContent
);


// UPDATE
router.put(
    "/:contentId",
    generalLimiter,
    authMiddleware,
    validate(updateContentSchema),
    updateContent
);


// DELETE
router.delete(
    "/",
    authMiddleware,
    generalLimiter,
    validate(deleteContentSchema),
    deleteAllContent
);

router.delete(
    "/:contentId",
    generalLimiter,
    authMiddleware,
    deleteContent
);




export default router;