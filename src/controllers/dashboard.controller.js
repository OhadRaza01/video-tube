import asyncHandler from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"


const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

    const { channelId } = req.params

    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, "channel id is invalid.")
    }

    const videos = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $group: {
                _id: null,
                totalVideos: { $sum: 1 },
                totalViews: { $sum: "$views" }
            }
        }
    ])

    const likes = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likeOnSingleVideo"
            }
        },
        {
            $group: {
                _id: null,
                totalLikes: {
                    $sum: { $size: "$likeOnSingleVideo" }
                }
            }
        }
    ])

    const totalSubscribers = await Subscription.countDocuments({

        channel: channelId

    })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    videos,
                    totalSubscribers,
                    likes
                },
                "stats fetched successfully"
            )
        )
})

export { getChannelStats }