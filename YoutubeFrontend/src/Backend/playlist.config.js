import { retry } from "@reduxjs/toolkit/query";
import server from "../conf/conf.js";
import axios from "axios";
axios.defaults.withCredentials = true;

export class PlaylistService {
  async getUserPlaylists(user) {
    try {
      const res = await axios.get(`${server.serverUrl}/playlist/user/${user}`);
      if (res) return res;
      else throw error;
    } catch (error) {
      console.error(error);
    }
  }

  async postPlaylist(data) {
    try {
      const res = await axios.post(`${server.serverUrl}/playlist`, data);
      if (res) return res;
      else throw error;
    } catch (error) {
      console.error(error);
    }
  }

  async addToPlaylist(videoId, playlistId) {
    try {
      // console.log("data is ", videoId,playlistId);
      const res = await axios.patch(
        `${server.serverUrl}/playlist/add/${videoId}/${playlistId}`
      );
      if (res) return res;
      else throw error;
    } catch (error) {
      console.error(error);
    }
  }

  async deletePlaylist(playlistId) {
    try {
      const res = await axios.delete(
        `${server.serverUrl}/playlist/${playlistId}`
      );
      if (res) return res;
      else throw error;
    } catch (error) {
      console.error(error);
    }
  }

  async getPlaylistVideos(playlistId) {
    try {
      const res = await axios.get(`${server.serverUrl}/playlist/${playlistId}`);
      if (res) return res;
      else throw error;
    } catch (error) {
      console.error(error);
    }
  }

  async deletePlaylistVideo(playlistId, videoId) {
    try {
      const res = await axios.patch(
        `${server.serverUrl}/playlist/remove/${videoId}/${playlistId}`
      );
      if (res) return res;
      else throw error;
    } catch (error) {
      console.error(error);
    }
  }
}
const playlistService = new PlaylistService();
export default playlistService;
