import { Router } from "express";
import jwtVerify from "../middlewares/auth.middleware.js";
import { createPlaylist } from "../controllers/playlist.controller.js";

const router = Router()

router.use(jwtVerify)

router.route("/").post(createPlaylist)

export default router