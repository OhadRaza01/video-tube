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

    const { page = 1, limit = 10 } = req.query;

    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.min(
        Math.max(Number(limit) || 10, 1),
        50
    );

    const skip = (pageNumber - 1) * limitNumber;

    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $skip: skip
        },
        {
            $limit: limitNumber
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                            thumbnail: 1,
                            views: 1,
                            duration: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$video"
        },
        {
            $replaceRoot: {
                newRoot: "$video"
            }
        }
    ])

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                likedVideos,
                "liked videos fetched successfully."
            )
        )

})


export { toggleVideoLike, toggleCommentLike, getLikedVideos }