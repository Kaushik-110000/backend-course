import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.model.js";

const getVideoComments = asyncHandler(async (req, res) => {
  // get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  if (!videoId) {
    throw new ApiError(400, "Video not found");
  }

  const totalcomments = await Comment.countDocuments({
    video: videoId,
  });

  const comments = await Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $skip: (Number(page) - 1) * Number(limit),
    },
    {
      $limit: Number(limit),
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              fullName: 1,
              userName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        totalcomments,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched"));
});

const addComment = asyncHandler(async (req, res) => {
  //  add a comment to a video
  const { videoId } = req.params;
  const { content } = req.body;
  const user = req.user;
  if (!videoId) {
    throw new ApiError(400, "Video not found");
  }
  if (!user?._id) {
    throw new ApiError("You must authenticate first");
  }
  if (!content) {
    throw new ApiError(400, "Request cannot be empty");
  }
  const comment = await Comment.create({
    content,
    video: videoId,
    owner: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Commented successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  //  update a comment
  const { commentId } = req.params;
  if (!commentId) {
    throw new ApiError(404, "Comment cannot be found");
  }

  const { newContent } = req.body;
  if (!newContent) {
    throw new ApiError(404, "New content not found");
  }

  const comment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content: newContent,
      },
    },
    {
      new: true,
    }
  );
  return res.status(200).json(new ApiResponse(200, comment, "Comment updated"));
});

const deleteComment = asyncHandler(async (req, res) => {
  //  delete a comment
  const { commentId } = req.params;
  if (!commentId) {
    throw new ApiError(404, "Comment cannot be found");
  }
  const comment = await Comment.findById(commentId);

  if (comment.owner.toString() != req.user._id.toString()) {
    throw new ApiError(401, "You cannot delete this comment");
  }
  await Comment.findByIdAndDelete(commentId);

  return res.status(200).json(200, {}, "Comment deleted");
});

export { getVideoComments, addComment, updateComment, deleteComment };
