import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
const KakaoLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const KakaologinHandler = async () => {
    const code = location.search.split("=")[1];
    axios
      .post("http://34.64.126.58/api/auth/kakao", {
        authorizationCode: code,
      })
      .then(res => {
        console.log("로그인 성공");
        localStorage.setItem("token", res.data);
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
