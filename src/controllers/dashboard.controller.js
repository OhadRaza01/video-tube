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

const getChannelVideos = asyncHandler(async (req, res) => {

    const { channelId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id.");
    }

    const pageNumber = Math.max(Number(page) || 1, 1);

    const limitNumber = Math.min(
        Math.max(Number(limit) || 10, 1),
        50
    );

    const skip = (pageNumber - 1) * limitNumber;

    const totalVideos = await Video.countDocuments({
        owner: channelId,
        isPublished: true
    });

    const totalPages = Math.ceil(totalVideos / limitNumber);

    const videos = await Video.find({
        owner: channelId,
        isPublished: true
    })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    videos,
                    pagination: {
                        page: pageNumber,
                        limit: limitNumber,
                        totalVideos,
                        totalPages
                    }
                },
                "Channel videos fetched successfully."
            )
        );
});

export { getChannelStats , getChannelVideos }