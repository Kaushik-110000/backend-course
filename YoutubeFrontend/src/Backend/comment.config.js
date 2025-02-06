import { retry } from "@reduxjs/toolkit/query";
import server from "../conf/conf.js";
import axios from "axios";
axios.defaults.withCredentials = true;

export class CommentService {
  async postComment(data) {
    console.log(data);
    try {
      const res = await axios.post(
        `${server.serverUrl}/comment/${data.videoId}`,
        { content: data.content }
      );
      if (res) return res;
      else throw error;
    } catch (error) {
      console.error(error);
    }
  }

  async upDateComment(commentId, newContent) {
    try {
      const res = await axios.patch(
        `${server.serverUrl}/comment/c/${commentId}`,
        newContent
      );
      if (res) return res;
      else throw error;
    } catch (error) {
      console.error(error);
    }
  }

  async getComments(videoId) {
    try {
      const res = await axios.get(`${server.serverUrl}/comment/${videoId}`, {
        params: { page: 1, limit: 10 },
      });
      if (res) return res;
      else throw error;
    } catch (error) {
      console.error(error);
    }
  }

  async deleteComment(commentId) {
    try {
      const res = await axios.delete(
        `${server.serverUrl}/comment/c/${commentId}`
      );
      if (res) return res;
      else throw error;
    } catch (error) {
      console.error(error);
    }
  }
}

const commentService = new CommentService();
export default commentService;
