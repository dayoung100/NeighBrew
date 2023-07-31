import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { callApi } from "../../utils/api";
const NaverLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const NaverloginHandler = async () => {
    const temcode = location.search.split("=")[1];
    const code = temcode.split("&")[0];
    const state = location.search.split("=")[2];
    axios
      .post("/api/auth/naver", {
        authorizationCode: code,
        state: state,
      })
      .then(res => {
        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
      })
      .then(async () => {
        await callApi("get", "api/user/guard/myinfo")
          .then(res => {
            localStorage.setItem("myId", JSON.stringify(res.data.userId));
          })
          .catch(err => console.log(err));
        await navigate("/meet");
      })
      .catch(err => {
        console.log(err);
      });
  };
  useEffect(() => {
    NaverloginHandler();
  }, []);
  return <div>로그인 창입니다 로딩 기다려</div>;
};
export default NaverLogin;
