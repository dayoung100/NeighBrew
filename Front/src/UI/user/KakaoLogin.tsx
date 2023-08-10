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
      .post("http://localhost:8080/api/auth/kakao", {
        authorizationCode: code,
      })
      .then(res => {
        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
      })
      .then(async () => {
<<<<<<< Updated upstream
        await callApi("get", "/api/user/guard/myinfo")
=======
        await callApi("get", "http://localhost:8080/api/user/guard/myinfo")
>>>>>>> Stashed changes
          .then(res => {
            localStorage.setItem("myId", JSON.stringify(res.data.userId));
            console.log(res.data);
          })
          .catch(err => console.log(err));
        // await navigate("/meet");
      })
      .catch(err => {
        console.log(err);
      });
  };
  useEffect(() => {
    KakaologinHandler();
  }, []);
  return <div>로딩중입니다.</div>;
};
export default KakaoLogin;
