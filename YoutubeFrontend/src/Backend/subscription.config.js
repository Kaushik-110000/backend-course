import { retry } from "@reduxjs/toolkit/query";
import server from "../conf/conf.js";
import axios from "axios";
axios.defaults.withCredentials = true;

export class SubscriptionService {
  async getSubscribers(channelId) {
    try {
      const res = await axios.get(
        `${server.serverUrl}/subscription/u/${channelId}`
      );
      if (res) return res;
      else throw error;
    } catch (error) {
      console.error(error);
    }
  }

  async toggleSubscription(channelId) {
    try {
      const res = await axios.post(
        `${server.serverUrl}/subscription/c/${channelId}`
      );
      if (res) return res;
      else throw error;
    } catch (error) {
      console.error(error);
    }
  }

  async getChannels(channelId) {
    try {
      const res = await axios.get(
        `${server.serverUrl}/subscription/c/${channelId}`
      );
      if (res) return res;
      else throw error;
    } catch (error) {
      console.error(error);
    }
  }
}

const subscriptionService = new SubscriptionService();
export default subscriptionService;
