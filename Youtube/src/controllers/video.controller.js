import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
  deletevideoFromCloudinary,
} from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 2, query, sortBy, sortType, userId } = req.query;
  // get all videos based on query, sort, pagination
  if (!userId) {
    throw new ApiError(400, "User id is missing");
  }

  const totalVideos = await Video.countDocuments({
    owner: userId,
    ...(query && { title: { $regex: query, $options: "i" } }), // Apply query filter if provided
  });

  const data = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $sort: {
        [sortBy]: Number(sortType),
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
        totalVideos,
      },
    },
  ]);

  if (!data) {
    throw new ApiError(400, "Videos not found");
  }

  return res.status(200).json(new ApiResponse(200, data, "Videos fetched"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video
  const user = req.user;
  if (!user?._id) {
    throw new ApiError(400, "You must be logged in to publish  video");
  }
  const thumbNailLocalPath = req.files?.thumbnail[0].path;

  if (!thumbNailLocalPath) {
    throw new ApiError(400, "Upload thumbnail");
  }

  const videoLocalPath = req.files?.videoFile[0].path;
  //   console.log(req.files.videoFile[0]);
  if (!videoLocalPath) {
    throw new ApiError(400, "Upload the video");
  }

  const thumbNail = await uploadOnCloudinary(thumbNailLocalPath);
  const videoFile = await uploadOnCloudinary(videoLocalPath);

  if (!thumbNail || !videoFile) {
    throw new ApiError(500, "Your files cannot be uploaded");
  }

  const duration = 10;
  const owner = user._id;
  const video = await Video.create({
    title,
    description,
    thumbNail: thumbNail.url,
    videoFile: videoFile.url,
    duration: videoFile.duration,
    owner,
  });
  if (!video) {
    throw new ApiError(500, "Video cant be uploaded");
  }
  return res.status(200).json(new ApiResponse(200, video, "Video uploaded"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  // get video by id
  if (!videoId) {
    throw new ApiError(400, "Video id not found");
  }
  const video = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
      },
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
  ]);
  if (!video) {
    throw new ApiError("Video not found");
  }
  console.log(video);
  return res.status(200).json(new ApiResponse(200, video, "Video found"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  // update video details like title, description, thumbnail
  if (!videoId) {
    throw new ApiError(400, "Video id not found");
  }

  const { title, description } = req.body;
  if (!title || !description) {
    throw new ApiError(400, "Titile or description empty");
  }
  const thumbnailPath = req.file?.path;
  console.log(req.file);
  if (!thumbnailPath) {
    throw new ApiError(404, "Thumbnail not found");
  }
  const thumbNail = await uploadOnCloudinary(thumbnailPath);

  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title,
        thumbNail: thumbNail.url,
        description,
      },
    },
    { new: true }
  );

  if (!video) {
    throw new ApiError(500, "Not updated");
  }
  return res.status(200).json(new ApiResponse(200, video, "Data updated"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //delete video
  if (!videoId) {
    throw new ApiError(400, "Which video to be deleted");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Video not found");
  }
  const { thumbNail, videoFile } = video;
  await deletevideoFromCloudinary(videoFile);
  await deleteFromCloudinary(thumbNail);
  await Video.findByIdAndDelete(videoId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(400, "Video id is missing");
  }
  const video = await Video.findById(videoId);
  const { isPublished } = video;
  video.isPublished = !isPublished;
  const result = await video.save({ new: true });
  //   console.log(result)
  return res
    .status(200)
    .json(new ApiResponse(200, result, "Changed published status"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
