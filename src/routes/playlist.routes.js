import { Router } from "express";
import jwtVerify from "../middlewares/auth.middleware.js";
import { createPlaylist, getUserPlaylists } from "../controllers/playlist.controller.js";

const router = Router()

router.use(jwtVerify)

router.route("/").post(createPlaylist)

router.route("/user/:userId/playlists").get(getUserPlaylists);

export default router