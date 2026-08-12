import { Router } from "express";
import jwtVerify from "../middlewares/auth.middleware.js";
import { createPlaylist, getPlaylistById, getUserPlaylists } from "../controllers/playlist.controller.js";

const router = Router()

router.use(jwtVerify)

router.route("/").post(createPlaylist)

router.route("/user/:userId/playlists").get(getUserPlaylists);

router
    .route("/:playlistId")
    .get(getPlaylistById)

export default router