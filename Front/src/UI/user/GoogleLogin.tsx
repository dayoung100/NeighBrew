import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { callApi } from "../../utils/api";
const GoogleLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const GoogleloginHandler = async () => {
    const temcode = location.search.split("=")[1];
    const code = temcode.split("&")[0];
    console.log(code);
    //34.64.126.58
    axios
      .post("http://34.64.126.58:9999/api/auth/google", {
        code: code,
      })
      .then(res => {
        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
      })
      .then(async () => {
        await callApi("get", "api/user/guard/myinfo")
          .then(res => {
            localStorage.setItem("myId", JSON.stringify(res.data.userId));
            // console.log(res.data);
          })
          .catch(err => console.log(err));
        await navigate("/meet");
      })
      .catch(err => {
        console.log(err);
      });
  };
  useEffect(() => {
    GoogleloginHandler();
  }, []);
  return <div>로그인 창입니다 로딩 기다려</div>;
};
export default GoogleLogin;
