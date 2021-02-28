import axios from "axios";
import { SOUNDCLOUD_KEY } from "./config";

/**
 * @description Provides a client to send requests to SoundCloud
 */
export const client = () => {
  return axios.create({
    baseURL: "https://api.soundcloud.com",
    timeout: 5000,
    params: {
      client_id: SOUNDCLOUD_KEY,
    },
  });
};
