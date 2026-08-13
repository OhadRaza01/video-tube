import { Router } from 'express';

import jwtVerify from "../middlewares/auth.middleware.js"
import { getLikedVideos, toggleCommentLike, toggleVideoLike } from '../controllers/like.controller.js';

const router = Router();
router.use(jwtVerify); 

router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike);
router.route("/videos").get(getLikedVideos);

export default router