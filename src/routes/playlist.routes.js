import { Router } from "express";
import jwtVerify from "../middlewares/auth.middleware.js";
import { addVideoToPlaylist, createPlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist } from "../controllers/playlist.controller.js";

const router = Router()

router.use(jwtVerify)

router.route("/").post(createPlaylist)

router.route("/user/:userId/playlists").get(getUserPlaylists);

router
    .route("/:playlistId")
    .get(getPlaylistById)

router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist)
router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist)

export default router