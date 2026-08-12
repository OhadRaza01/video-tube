import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const toggleSubscription = asyncHandler(async (req, res) => {

    const { channelId } = req.params

    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, "Channel id is invalid.")
    }

    const existedSubscription = await Subscription.findOne({
        subscriber: req.user._id,
        channel: channelId
    })

    if (existedSubscription) {
        await existedSubscription.deleteOne()

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "Channel unsubscribed successfully."
                )
            );
    }

    const subscription = await Subscription.create({

        subscriber: req.user._id,
        channel: channelId

    })

    if (!subscription) {
        throw new ApiError(500, "Something went wrong while creating subscription.")
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                subscription,
                "channel is subscribed succesfully."
            )
        )

})

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, "Channel id is invalid.")
    }

    const subscribers = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscribers",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                subscriber: {
                    $first: "$subscribers"
                }
            }
        },
        {
            $project: {
                _id: 0,
                subscriber: 1
            }
        }
    ])

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                subscribers,
                "subscribers fectched successfully."
            )
        )
})

const getSubscribedChannels = asyncHandler(async (req, res) => {
    
    const { subscriberId } = req.params
    
    if (!mongoose.isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Channel id is invalid.")
    }

    const subscribedTo = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "subscribedTo",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                channel: {
                    $first: "$subscribedTo"
                }
            }
        },
        {
            $project: {
                _id: 0,
                channel: 1
            }
        }
    ])

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                subscribedTo,
                "Subscribed channels fectched successfully."
            )
        )
})

export { toggleSubscription, getUserChannelSubscribers , getSubscribedChannels }