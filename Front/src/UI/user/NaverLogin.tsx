import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
const NaverLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const NaverloginHandler = async () => {
    const code = location.search.split("=")[1];
    const state = location.search.split("=")[2];
    axios
      .post("http://192.168.31.71:8080/api/auth/naver", {
        authorizationCode: code,
        state: state,
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
    NaverloginHandler();
  }, []);
  return <div>로그인 창입니다 로딩 기다려</div>;
};
export default NaverLogin;
