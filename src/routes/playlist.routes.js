import { Router } from "express";
import jwtVerify from "../middlewares/auth.middleware.js";
import { addVideoToPlaylist, createPlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from "../controllers/playlist.controller.js";

const router = Router()

router.use(jwtVerify)

router.route("/").post(createPlaylist)

router.route("/user/:userId/playlists").get(getUserPlaylists);

router
    .route("/:playlistId")
    .get(getPlaylistById)
    .patch(updatePlaylist)

router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist)
router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist)

export default router