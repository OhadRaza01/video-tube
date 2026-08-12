import jwtVerify from '../middlewares/auth.middleware.js';
import { addComment, deleteComment, getVideoComments, updateComment } from '../controllers/comment.controller.js';

import { Router } from 'express';

const router = Router()

router.use(jwtVerify); // Apply verifyJWT middleware to all routes in this file

router.route("/:videoId")
    .get(getVideoComments)
    .post(addComment);

router.route("/c/:commentId")
    .delete(deleteComment)
    .patch(updateComment)

export default router