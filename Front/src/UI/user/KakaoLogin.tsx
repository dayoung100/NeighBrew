import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
const KakaoLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const KakaologinHandler = async () => {
    const code = location.search.split("=")[1];
    axios
      .post("http://192.168.31.71:8080/api/auth/kakao", {
        authorizationCode: code,
      })
      .then(res => {
        localStorage.setItem("token", res.data);
        navigate("/meet");
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
