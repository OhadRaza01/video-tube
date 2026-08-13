import asyncHandler from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Like } from "../models/like.model.js"


const toggleVideoLike = asyncHandler(async (req, res) => {

    const { videoId } = req.params

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id.");
    }

    const video = await Video.exists({
        _id: videoId
    })

    if (!video) {
        throw new ApiError(404, "Video not found.")
    }

    const existinglike = await Like.findOneAndDelete({
        video: videoId,
        likedBy: req.user._id
    })

    if (existinglike) {
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "video is unliked successfully."
                )
            );
    }

    const like = await Like.create({
        video: videoId,
        likedBy: req.user._id
    })

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                like,
                "video liked successfully."
            )
        )

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params

    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment id.");
    }

    const commentExists = await Comment.exists({
        _id: commentId
    })

    if (!commentExists) {
        throw new ApiError(404, "Comment not found.")
    }

    const existinglike = await Like.findOneAndDelete({
        comment: commentId,
        likedBy: req.user._id
    })

    if (existinglike) {
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "Comment is unliked successfully."
                )
            );
    }

    const like = await Like.create({
        comment: commentId,
        likedBy: req.user._id
    })

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                like,
                "Comment liked successfully."
            )
        )
})


const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
})


export { toggleVideoLike, toggleCommentLike, getLikedVideos }