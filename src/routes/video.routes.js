import { Router } from "express";
import jwtVerify from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { deleteVideo, getAllVideos, getUserVideos, getVideoById, increamentVideoView, updateThumbnail, updateVideoDetails, uploadVideo, togglePublishStatus } from "../controllers/video.controller.js";


const router = Router()

router.route("/upload-video").post(
    jwtVerify,
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    uploadVideo
)

router.route("/delete-video/:videoId").delete(
    jwtVerify,
    deleteVideo
)

router.route("/my-videos").get(
    jwtVerify,
    getUserVideos
)

router.route("/").get(
    getAllVideos
)

router.route("/update-video-details/:videoId").patch(
    jwtVerify,
    updateVideoDetails
)

router.route("/:videoId/thumbnail").patch(
    jwtVerify,
    upload.single("thumbnail"),
    updateThumbnail
)

router.route("/:videoId").get(
    getVideoById
)

router.route("/:videoId/view").post(
    increamentVideoView
);

router.route("/toggle/publish/:videoId").patch(jwtVerify, togglePublishStatus);

export default router;