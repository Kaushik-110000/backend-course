import { Router } from "express";
import {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet,
} from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/create-tweet").post(verifyJWT, createTweet);
router.route("/getTweets/:userName").get(verifyJWT, getUserTweets);
router.route("/updateTweet/:tweetId").post(verifyJWT, updateTweet);
router.route("/deleteTweet/:tweetId").get(verifyJWT, deleteTweet);
export default router;
