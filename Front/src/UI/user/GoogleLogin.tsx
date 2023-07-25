import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
const GoogleLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const GoogleloginHandler = async () => {
    const temcode = location.search.split("=")[1];
    const code = temcode.split("&")[0];
    axios
      .post("http://34.64.126.58/api/auth/google", {
        code: code,
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
    GoogleloginHandler();
  }, []);
  return <div>로그인 창입니다 로딩 기다려</div>;
};
export default GoogleLogin;
