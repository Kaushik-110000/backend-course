import { retry } from "@reduxjs/toolkit/query";
import server from "../conf/conf.js";
import axios from "axios";
axios.defaults.withCredentials = true;

export class TweetService {
  async postTweet(content) {
    try {
      const res = axios.post(
        `${server.serverUrl}/tweets/create-tweet`,
        content
      );
      if (res) return res;
      else throw error;
    } catch (error) {
      console.error(error);
    }
  }

  async getTweets(userName) {
    try {
      const res = axios.get(`${server.serverUrl}/tweets/getTweets/${userName}`);
      if (res) return res;
      else throw error;
    } catch (error) {
      console.error(error);
    }
  }

  async upDateTweet(tweetId, { newcontent }) {
    console.log({ newcontent });
    try {
      const res = axios.post(
        `${server.serverUrl}/tweets/updateTweet/${tweetId}`,
        { newcontent }
      );
      if (res) return res;
      else throw error;
    } catch (error) {
      console.error(error);
    }
  }

  async deleteTweet(tweetId) {
    try {
      const res = axios.get(
        `${server.serverUrl}/tweets/deleteTweet/${tweetId}`
      );
      if (res) return res;
      else throw error;
    } catch (error) {
      console.error(error);
    }
  }
}

const tweetService = new TweetService();
export default tweetService;
