import { retry } from "@reduxjs/toolkit/query";
import server from "../conf/conf.js";
import axios from "axios";
axios.defaults.withCredentials = true;

export class LikeService {
  async likedVideos() {
    try {
      const res = await axios.get(`${server.serverUrl}/like/videos`);
      if (res) return res;
      else throw error;
    } catch (error) {
      console.error(error);
    }
  }

  async toggleLike(videoId) {
    try {
      const res = await axios.post(
        `${server.serverUrl}/like/toggle/v/${videoId}`
      );
      if (res) return res;
      else throw error;
    } catch (error) {
      console.error(error);
    }
  }
}

const likeService = new LikeService();
export default likeService;
