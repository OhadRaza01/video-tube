import { Comment } from "../models/comment.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Video } from "../models/video.model.js";

const addComment = asyncHandler(async (req, res) => {

    const { content } = req.body;
    const { videoId } = req.params;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id.");
    }

    if (!content?.trim()) {
        throw new ApiError(400, "Please enter some content.");
    }

    const videoExists = await Video.exists({
        _id: videoId
    });

    if (!videoExists) {
        throw new ApiError(404, "Video not found.");
    }

    const comment = await Comment.create({
        content: content.trim(),
        video: videoId,
        owner: req.user._id
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                comment,
                "Comment added successfully."
            )
        );
});

const updateComment = asyncHandler(async (req, res) => {

    const { commentId } = req.params
    const { content } = req.body

    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment id.");
    }

    if (!content?.trim()) {
        throw new ApiError(400, "Please enter some content.");
    }

    const comment = await Comment.findOneAndUpdate(
        {
            _id: commentId,
            owner: req.user._id
        },
        {
            $set: {
                content: content.trim()
            }
        },
        { returnDocument: "after" }
    )

    if (!comment) {
        throw new ApiError(404, "Comment not found or you are not authorized.")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                comment,
                "comment is updated successfully."
            )
        )

})

const deleteComment = asyncHandler(async (req, res) => {

    const { commentId } = req.params

    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment id.");
    }

    const comment = await Comment.findOneAndDelete({
        _id: commentId,
        owner: req.user._id
    })

    if (!comment) {
        throw new ApiError(404, "Comment not found or you are not authorized.")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "comment is deleted successfully."
            )
        )

})

const getVideoComments = asyncHandler(async (req, res) => {
   
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id.");
    }

    const pageNumber = Math.max(Number(page) || 1, 1);

    const limitNumber = Math.min(
        Math.max(Number(limit) || 10, 1),
        50
    );

    const skip = (pageNumber - 1) * limitNumber;

    const totalComments = await Comment.countDocuments({
        video: videoId
    });

    const totalPages = Math.ceil(totalComments / limitNumber);

    const comments = await Comment.find({
        video: videoId
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
                    comments,
                    pagination: {
                        page: pageNumber,
                        limit: limitNumber,
                        totalComments,
                        totalPages
                    }
                },
                "Comments fetched successfully."
            )
        );
});

export { addComment, updateComment, deleteComment, getVideoComments }