import { Router } from "express";
import jwtVerify from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { deleteVideo, getAllVideos, getUserVideos, uploadVideo } from "../controllers/video.controller.js";


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

export default router;