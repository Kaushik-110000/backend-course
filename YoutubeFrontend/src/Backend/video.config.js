import { retry } from "@reduxjs/toolkit/query";
import server from "../conf/conf.js";
import axios from "axios";
axios.defaults.withCredentials = true;

export class VideoService {
  async getAllVideos(page = 1, limit = 4) {
    try {
      const data = await axios.get(
        `${server.serverUrl}/videos/allvideos?page=${page}&limit=${limit}`
      );
      if (data) return data;
      else throw error;
    } catch (error) {
      console.error(error);
    }
  }

  async findVideo(videoId) {
    try {
      const data = await axios.get(`${server.serverUrl}/videos/${videoId}`);
      if (data) return data;
      else throw error;
    } catch (error) {
      console.error(error);
    }
  }

  async uploadVideo(data) {
    console.log(data);
    try {
      const res = await axios.post(`${server.serverUrl}/videos`, data, {
        headers: {
          "Content-Type": "multipart/form-data", // Let axios set the correct content-type
        },
      });
      if (res) return res;
      else throw error;
    } catch (error) {
      console.error(error);
    }
  }

  async deleteVideo(videoId) {
    try {
      const res = await axios.delete(`${server.serverUrl}/videos/${videoId}`);
      if (res) return res;
      else throw error;
    } catch (error) {
      console.error(error);
    }
  }

  async togglePublish(videoId) {
    try {
      const res = await axios.patch(
        `${server.serverUrl}/videos/toggle/publish/${videoId}`
      );
      if (res) return res;
      else throw error;
    } catch (error) {
      console.error(error);
    }
  }

  async getVideoofUser(userId) {
    console.log(userId);
    try {
      const res = await axios.get(
        `${server.serverUrl}/videos?userId=${userId}`
      );
      if (res) return res;
      else throw error;
    } catch (error) {
      console.error(error);
    }
  }

  async updateVideo(videoId, data) {
    console.log(data.thumbnail);
    try {
      const res = await axios.patch(
        `${server.serverUrl}/videos/${videoId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Let axios set the correct content-type
          },
        }
      );
      if (res) return res;
      else throw error;
    } catch (error) {
      console.error(error);
    }
  }

  async getWatchHistory() {
    try {
      const res = await axios.get(`${server.serverUrl}/users/watch-History`);
      if (res) return res;
      else throw error;
    } catch (error) {
      console.error(error);
    }
  }
}
const videoService = new VideoService();
export default videoService;
