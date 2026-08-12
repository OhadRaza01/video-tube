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

export { createPlaylist }