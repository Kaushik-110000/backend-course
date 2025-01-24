import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  // create tweet
  const user = req.user;

  if (!user?._id) {
    throw new ApiError(401, "You are not authorised to tweet , Login first");
  }
  const id = user?._id;
  const { content } = req.body;
  if (!content) {
    throw new ApiError(400, "Content cannot be empty");
  }

  const tweet = await Tweet.create({
    content,
    owner: id,
  });

  const createdTweet = await Tweet.findById(tweet?._id);

  if (!createdTweet) {
    throw new ApiError(501, "Tweet cannot be sent to server");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdTweet, "Tweeted successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  //  get user tweets

  const { userName } = req.params;
  if (!userName?.trim()) {
    throw new ApiError(400, "UserName is missing");
  }

  const myTweets = await User.aggregate([
    {
      $match: {
        userName: userName?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "tweets",
        localField: "_id",
        foreignField: "owner",
        as: "tweets",
      },
    },
    {
      $project: {
        userName: 1,
        tweets: 1,
        avatar: 1,
        fullName: 1,
      },
    },
  ]);

  if (!myTweets) {
    throw new ApiError(401, "Could not fetch the tweets");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, myTweets, "Tweets fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  //update tweet

  const user = req.user;
  if (!user) {
    throw new ApiError(400, "Unauthorised access");
  }

  // console.log("req params is ", req.body);

  const { tweetId } = req.params;
  if (!tweetId) {
    throw new ApiError(400, "Choose the tweet to update");
  }

  const { newcontent } = req.body;
  if (!newcontent) {
    throw new ApiError(400, "Request cannot be empty");
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(400, "Tweet cannot be found");
  }

  if (tweet?.owner.toString() != user?._id.toString()) {
    throw new ApiError(400, "You connot edit someone else tweet");
  }

  tweet.content = newcontent;

  const data = await tweet.save({ new: true });

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  // delete tweet
  const user = req.user;
  if (!user) {
    throw new ApiError(400, "Unauthorised access");
  }

  const { tweetId } = req.params;
  if (!tweetId) {
    throw new ApiError(400, "Choose the tweet to delete");
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(400, "Tweet cannot be found");
  }

  if (tweet?.owner.toString() != user?._id.toString()) {
    throw new ApiError(400, "You connot delete someone else tweet");
  }

  await Tweet.deleteOne({ _id: tweetId });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
