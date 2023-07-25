import axios from "axios";

const api = axios.create({
  baseURL: "http://34.64.126.58/",
});

export const callApi = async (method: string, url: string, body: any = {}) => {
  return api({
    method: method,
    url: url,
    headers: { Authorization: localStorage.getItem("token") },
    data: body,
  })
    .then(res => {
      res.data;
    })
    .catch(err => {
      err.response.data;
    });
};
