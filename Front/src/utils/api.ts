import axios from "axios";

const api = axios.create({
  baseURL: "http://34.64.126.58:5173/",
});

export const callApi = async (method: string, url: string, body: any = {}) => {
  return api({
    method: method,
    url: url,
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    data: body,
  });
};
