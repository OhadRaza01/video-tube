import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Playlist } from "../models/playlist.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createPlaylist = asyncHandler(async (req, res) => {

    const { name, description } = req.body

    if (!name.trim() || !description.trim()) {
        throw new ApiError(400, "All fields are required.")
    }

    const playlist = await Playlist.create({
        name: name.trim(),
        description: description.trim(),
        owner: req.user._id
    })

    return res
        .status(201)
        .json(

            new ApiResponse(
                201,
                playlist,
                "Playlist is created successfully."
            )
        )

})

const getUserPlaylists = asyncHandler(async (req, res) => {

    const { userId } = req.params

    const { page = 1, limit = 10 } = req.query

    const pageNumber = Math.max(Number(page) || 1, 1)
    const limitNumber = Math.min(
        Math.max(Number(limit) || 10, 1),
        50
    )

    const skip = (pageNumber - 1) * limitNumber

    if (!mongoose.isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user id.")
    }

    const totalPlaylists = await Playlist.countDocuments({
        owner: userId
    })

    const totalPages = Math.ceil(totalPlaylists / limitNumber)

    const userPlaylists = await Playlist.find({
        owner: userId
    })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    playlists: userPlaylists,
                    pagination: {
                        page: pageNumber,
                        limit: limitNumber,
                        totalPlaylists,
                        totalPages
                    }
                },
                "playlists fetched successfully."
            )
        )

})

export { createPlaylist, getUserPlaylists }