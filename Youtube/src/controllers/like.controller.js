import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Like } from "../models/like.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(400, "Video id is missing");
  }
  // toggle like on video
  const user = req.user;
  // console.log(res.u/)
  if (!user?._id) {
    throw new ApiError(400, "User not authenticated");
  }
  const like = await Like.findOne({
    video: videoId,
    likedBy: user._id,
  });

  if (!like) {
    const newLike = await Like.create({
      video: videoId,
      likedBy: user._id,
    });
    if (!newLike) {
      throw new ApiError(500, "Could not like");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, newLike, "Liked the video"));
  }

  await Like.findByIdAndDelete(like._id);
  return res.status(200).json(new ApiResponse(200, {}, "Unliked the video"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  // toggle like on comment

  if (!commentId) {
    throw new ApiError(400, "Comment id is missing");
  }

  if (!mongoose.isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment id");
  }

  const user = req.user;
  if (!user?._id) {
    throw new ApiError(400, "User not authenticated");
  }

  const like = await Like.findOne({
    comment: commentId,
    likedBy: user._id,
  });

  if (!like) {
    const newLike = await Like.create({
      comment: commentId,
      likedBy: user._id,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, newLike, "Liked the comment"));
  }

  await Like.findByIdAndDelete(like._id);
  return res.status(200).json(new ApiResponse(200, {}, "Unliked the comment"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  // const { tweetId } = req.params;
  // toggle like on tweet
  const { tweetId } = req.params;
  if (!tweetId) {
    throw new ApiError(400, "Tweet id is missing");
  }

  if (!mongoose.isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet id");
  }

  const user = req.user;
  if (!user?._id) {
    throw new ApiError(400, "User not authenticated");
  }

  const like = await Like.findOne({
    tweet: tweetId,
    likedBy: user._id,
  });

  if (!like) {
    const newLike = await Like.create({
      tweet: tweetId,
      likedBy: user._id,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, newLike, "Liked the tweet"));
  }

  await Like.findByIdAndDelete(like._id);
  return res.status(200).json(new ApiResponse(200, {}, "Unliked the tweet"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //get all liked videos
  const user = req.user;
  if (!user?._id) {
    throw new ApiError(400, "User id is missing");
  }
  const videos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(user._id),
        video: { $exists: true },
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    userName: 1,
                    fullName: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $project: {
              thumbNail: 1,
              title: 1,
              duration: 1,
              description: 1,
              isPublished: 1,
              owner: 1,
            },
          },
          {
            $set: {
              owner: { $arrayElemAt: ["$owner", 0] },
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        video: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "LIked videos fetched"));
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
