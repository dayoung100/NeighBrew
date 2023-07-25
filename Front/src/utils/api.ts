import axios from "axios";

const api = axios.create({
  baseURL: "http://34.64.126.58/",
});

export const getMeetings = async () => {
  return api.get(`api/meet`).then(res => res.data);
};
