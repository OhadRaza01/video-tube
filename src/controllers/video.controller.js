import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/fileUpload.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { deleteFileFromCloudinary } from "../utils/deleteFile.js";

const uploadVideo = asyncHandler(async (req, res) => {

    const { title, description } = req.body

    if (!title || !description) {
        throw new ApiError(400, "All fields are required.")
    }

    const videoFileLocalPath = req.files?.videoFile?.[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path

    if (!videoFileLocalPath) {
        throw new ApiError(400, "Video file is required")
    }

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumnail is required")
    }

    const videoFile = await uploadOnCloudinary(videoFileLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if (!videoFile || !thumbnail) {
        throw new ApiError(500, "something went wrong while uploading files to cloudinary")
    }

    const video = await Video.create({
        videoFile: videoFile.secure_url,
        videoPublicId: videoFile.public_id,

        thumbnail: thumbnail.secure_url,
        thumbnailPublicId: thumbnail.public_id,

        title,
        description,
        duration: videoFile.duration,
        owner: req.user._id
    })

    if (!video) {
        throw new ApiError(500, "something went wrong while uploading video")
    }

    return res
        .status(201)
        .json(
            new ApiResponse(201, { video }, "Video is uploaded successfully")
        )
})

const deleteVideo = asyncHandler(async (req, res) => {

    const { videoId } = req.params

    if (!videoId) {
        throw new ApiError(404, "video not found")
    }

    const video = await Video.findOne({
        _id: videoId,
        owner: req.user._id
    });

    if (!video) {
        throw new ApiError(404, "Video not found or you are not authorized");
    }

    const videoPublicId = video.videoPublicId
    const thumbnailPublicId = video.thumbnailPublicId

    await deleteFileFromCloudinary(videoPublicId, "video")
    await deleteFileFromCloudinary(thumbnailPublicId, "image")

    await video.deleteOne();

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Video is deleted successfully")
        )

})

const getUserVideos = asyncHandler(async (req, res) => {

    //req.user se user fetch krlo
    //find kro current user ki jo id hai usse videos nikal lo
    //check lagao and response send krdo

    const videos = await Video.find({ // returns array
        owner: req.user._id
    })

    if (!videos.length) {
        throw new ApiError(404, "No videos found.")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, videos, "videos fetched successfully")
        )

})

const getAllVideos = asyncHandler(async (req, res) => {

    const videos = await Video.find({
        isPublished: true
    })

    if (!videos.length) {
        throw new ApiError(404, "No videos found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, videos, "videos fetched successfully.")
        )

})

const updateVideoDetails = asyncHandler(async (req, res) => {

    const { description, title } = req.body

    const { videoId } = req.params

    if (!description && !title) {
        throw new ApiError(400, "title or description is required.")
    }

    const updateFields = {};

    if (title) {
        updateFields.title = title;
    }

    if (description) {
        updateFields.description = description;
    }

    const video = await Video.findOneAndUpdate({ _id: videoId, owner: req.user?._id }, {

        $set: updateFields

    }, { returnDocument: "after" })

    if (!video) {
        throw new ApiError(404, "Video not found or you are not authorized");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, video, "video details are updated successfully.")
        )

})

const updateThumbnail = asyncHandler(async (req, res) => {

    const thumbnailLocalPath = req.file?.path

    const { videoId } = req.params

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail is required.")
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if (!thumbnail) {
        throw new ApiError(500, "Error during uploading file to cloudinary.")
    }

    const video = await Video.findOne({ _id: videoId, owner: req.user?._id })

    if (!video) {
        throw new ApiError(404, "Video not found or you are not authorized");
    }

    video.thumbnail = thumbnail.secure_url
    video.thumbnailPublicId = thumbnail.public_id

    await video.save()

    await deleteFileFromCloudinary()

    return res
        .status(200)
        .json(
            new ApiResponse(200, video, "thumbnail is updated succesfully")
        )

})

const getVideo = asyncHandler(async (req, res) => {

})

const increamentVideoView = asyncHandler(async (req, res) => {

})

export { uploadVideo, deleteVideo, getUserVideos, getAllVideos, updateVideoDetails, updateThumbnail }