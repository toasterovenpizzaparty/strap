import axios from "axios";

export const client = () => {
  return axios.create({
    baseURL: "https://api.soundcloud.com",
    timeout: 5000,
    params: {
      client_id: "3a792e628dbaf8054e55f6e134ebe5fa",
    },
  });
};

export const buildQs = (values: Record<string, string>) =>
  values &&
  Object.keys(values)
    .map((key) => `${key}=${values[key]}`)
    .join("&");
