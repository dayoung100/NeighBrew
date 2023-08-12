import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { callApi } from "../../utils/api";
import Loading from "../etc/Loading";

const GoogleLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const GoogleloginHandler = async () => {
    const temcode = location.search.split("=")[1];
    const code = temcode.split("&")[0];
    axios
      .post("/api/auth/google", {
        code: code,
      })
      .then((res) => {
        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
      })
      .then(async () => {
        await callApi("get", "api/user/guard/myinfo")
          .then((res) => {
            localStorage.setItem("myId", JSON.stringify(res.data.userId));
          })
          .catch((err) => console.log(err));
        await navigate("/meet");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    GoogleloginHandler();
  }, []);
  return <Loading />;
};
export default GoogleLogin;
