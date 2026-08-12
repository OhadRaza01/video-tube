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
    // TODO: update a comment
})

const deleteComment = asyncHandler(async (req, res) => {

    const { commentId } = req.params

    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid video id.");
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

export { addComment, updateComment, deleteComment }