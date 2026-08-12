import mongoose, { mongo } from "mongoose";
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

const getPlaylistById = asyncHandler(async (req, res) => {

    const { playlistId } = req.params;

    if (!mongoose.isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id.");
    }

    const playlist = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                            thumbnail: 1,
                            duration: 1,
                            views: 1
                        }
                    }
                ]
            }
        },
        {
            $project: {
                name: 1,
                description: 1,
                owner: 1,
                videos: 1
            }
        }
    ]);

    if (!playlist.length) {
        throw new ApiError(404, "Playlist not found.");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlist[0],
                "Playlist fetched successfully."
            )
        );
});

//play list me video add krne kai baad getPlaylistById ki testing krni hai

const addVideoToPlaylist = asyncHandler(async (req, res) => {

    const { playlistId, videoId } = req.params

    if (!mongoose.isValidObjectId(playlistId) || !mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist or video id.")
    }

    const playlist = await Playlist.findOneAndUpdate(
        {
            _id: playlistId,
            owner: req.user._id
        },
        {
            $addToSet: {
                videos: videoId
            }
        },
        { returnDocument: "after" }
    )

    if (!playlist) {
        throw new ApiError(404, "playlist not found.")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlist,
                "video is added successfully."
            )
        )


})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {

    const { playlistId, videoId } = req.params

    if (!mongoose.isValidObjectId(playlistId) || !mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist or video id.")
    }

    const playlist = await Playlist.findOneAndUpdate(
        {
            _id: playlistId,
            owner: req.user._id
        },
        {
            $pull: {
                videos: videoId
            }
        },
        { returnDocument: "after" }
    )

    if (!playlist) {
        throw new ApiError(404, "Playlist not found or you are not authorized.")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlist,
                "Video removed from playlist successfully."
            )
        )

})

const updatePlaylist = asyncHandler(async (req, res) => {

    const { playlistId } = req.params
    const { name, description } = req.body

    if (!mongoose.isValidObjectId(playlistId)) {
        throw new ApiError(400, "playlist id is invalid.")
    }

    if ((!name || !name.trim()) && (!description || !description.trim())) {
        throw new ApiError(400, "Please enter a title or description.");
    }

    const changes = {}

    if (name?.trim()) {
        changes.name = name.trim()
    }
    if (description?.trim()) {
        changes.description = description.trim()
    }

    const playlist = await Playlist.findOneAndUpdate(
        {
            _id: playlistId,
            owner: req.user._id
        },
        {
            $set: changes
        },
        { returnDocument: "after" }
    )

    if (!playlist) {
        throw new ApiError(400, "Playlist not found or you are not authorized.")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlist,
                "playlist is updated successfully."
            )
        )
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!mongoose.isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id.");
    }

    const playlist = await Playlist.findOneAndDelete({
        _id: playlistId,
        owner: req.user._id
    });

    if (!playlist) {
        throw new ApiError(
            404,
            "Playlist not found or you are not authorized."
        );
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Playlist deleted successfully."
            )
        );
});

export { createPlaylist, getUserPlaylists, getPlaylistById, addVideoToPlaylist, removeVideoFromPlaylist, updatePlaylist , deletePlaylist }