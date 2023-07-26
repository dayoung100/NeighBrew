import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
const KakaoLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const KakaologinHandler = async () => {
    const code = location.search.split("=")[1];
    axios
      .post("http://34.64.126.58:5173/api/auth/kakao", {
        // .post("http://192.168.31.71:8080/api/auth/kakao", {
        authorizationCode: code,
      })
      .then(res => {
        console.log("로그인 성공");
        console.log(res.data);
        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        navigate("/meet");
      })
      .catch(err => {
        console.log(err);
        console.log("로그인 에러");
      });
  };
  useEffect(() => {
    KakaologinHandler();
  }, []);
  return <div>로그인 창입니다 로딩 기다려</div>;
};
export default KakaoLogin;
