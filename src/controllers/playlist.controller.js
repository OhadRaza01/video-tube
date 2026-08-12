import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Playlist } from "../models/playlist.model.js";

const createPlaylist = asyncHandler(async (req, res) => {

    const { name, description } = req.body

    if (!name || !description) {
        throw new ApiError(400, "All fields are required.")
    }

    const playlist = await Playlist.create({
        name,
        description
    })

    if (!playlist) {
        throw new ApiError(500, "Something went wrong while creating playlist.")
    }

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