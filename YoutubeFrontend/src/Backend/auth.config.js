import { retry } from "@reduxjs/toolkit/query";
import server from "../conf/conf.js";
import axios from "axios";
axios.defaults.withCredentials = true;

export class Authservice {
  async createAccount(data) {
    try {
      console.log(data);
      const response = await axios.post(
        `${server.serverUrl}/users/register`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Let axios set the correct content-type
          },
        }
      );
      if (response) {
        return response;
      } else throw error;
    } catch (error) {
      throw error;
    }
  }

  async login(data) {
    try {
      const response = await axios.post(
        `${server.serverUrl}/users/login`,
        data,
        {
          withCredentials: true,
        }
      );
      if (response) return response;
      else throw error;
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const response = await axios.post(
        `${server.serverUrl}/users/current-user`
      );
      if (response.status == 200) {
        const {
          _id,
          userName,
          email,
          fullName,
          avatar,
          refreshToken,
          coverImage,
        } = response.data.data;
        return {
          _id,
          userName,
          email,
          fullName,
          avatar,
          refreshToken,
          coverImage,
        };
      } else throw error;
    } catch (err) {
      throw err;
    }
  }

  async getChannel(userId) {
    try {
      const res = await axios.get(`${server.serverUrl}/users/c/${userId}`);
      if (res) return res;
      else throw error;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      const res = await axios.post(`${server.serverUrl}/users/logout`);
      if (res.status == 200) return res;
      else throw error;
    } catch (error) {
      console.error(error.message);
    }
  }

  //use like useeffect in home page
  async refreshTokens() {
    try {
      const res = await axios.post(`${server.serverUrl}/users/refresh-tokens`, {
        withCredentials: true,
      });
      if (res.status == 200) return res;
      else throw error;
    } catch (error) {
      console.error(error.message);
    }
  }

  async changePassword(data) {
    console.log(data);
    try {
      const res = await axios.post(
        `${server.serverUrl}/users/change-password`,
        data
      );
      if (res) return res;
      else throw error;
    } catch (error) {
      throw error;
    }
  }

  async updateDetails(data) {
    console.log(data);
    try {
      const res = await axios.post(
        `${server.serverUrl}/users/update-details`,
        data
      );
      if (res.status == 200) return res;
      else throw error;
    } catch (error) {
      throw error;
    }
  }

  async updateAvatar(data) {
    console.log(data);
    try {
      const res = await axios.post(
        `${server.serverUrl}/users/updateAvatar`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Let axios set the correct content-type
          },
        }
      );
      if (res.status == 200) return res;
      else throw error;
    } catch (error) {
      throw error;
    }
  }

  async updateCoverImage(data) {
    try {
      const res = await axios.post(
        `${server.serverUrl}/users/updateCoverImage`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Let axios set the correct content-type
          },
        }
      );
      if (res.status == 200) return res;
      else throw error;
    } catch (error) {
      throw error;
    }
  }

  async checkRefresh() {
    try {
      const res = await axios.get(`${server.serverUrl}/users/check-refresh`);
      if (res) return res;
      else throw error;
    } catch (error) {
      throw error;
    }
  }
}

const authservice = new Authservice();
export default authservice;
