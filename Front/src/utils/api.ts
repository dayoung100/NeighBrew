import axios from "axios";

const api = axios.create({
  baseURL: "/",
});

export const callApi = async (method: string, url: string, body: any = {}) => {
  return api({
    method: method,
    url: url,
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    data: body,
  });
};
