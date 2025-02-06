import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // toggle subscription
  const user = req.user;
  // console.log(res.u/)
  if (!user?._id) {
    throw new ApiError(400, "User not authenticated");
  }
  const subscriptionCard = await Subscription.findOne({
    channel: channelId,
    subscriber: user._id,
  });

  if (!subscriptionCard) {
    console.log("hi", subscriptionCard);
    const sub = await Subscription.create({
      channel: channelId,
      subscriber: user._id,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, sub, "Subscribed successfully"));
  } else {
    await Subscription.findByIdAndDelete(subscriptionCard._id);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Unsubscribed successfully"));
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  if (!subscriberId) {
    throw new ApiError(400, "Channel not found");
  }
  const subscriptionCard = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(subscriberId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriberData",
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
        subscriberData: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, subscriptionCard, "Subscribers fetched"));
});

// controller to return channel list to which user has subscribed

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!channelId) {
    throw new ApiError(400, "Channel not found");
  }

  const subscriptionCard = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channelData",
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
        channelData: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, subscriptionCard, "Subscribed channels fetched")
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
