import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { callApi } from "../../utils/api";
const KakaoLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const KakaologinHandler = async () => {
    const code = location.search.split("=")[1];
    axios
      .post("http://34.64.126.58:9999/api/auth/kakao", {
        // .post("http://192.168.31.71:8080/api/auth/kakao", {
        authorizationCode: code,
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
    KakaologinHandler();
  }, []);
  return <div>로그인 창입니다 로딩 기다려</div>;
};
export default KakaoLogin;
