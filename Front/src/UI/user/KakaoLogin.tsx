import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Loading from "../etc/Loading";

const KakaoLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const KakaologinHandler = async () => {
    const code = location.search.split("=")[1];
    axios
      .post("http://localhost:8080/api/auth/kakao", {
        authorizationCode: code,
      })
      .then((res) => {
        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        localStorage.setItem("myId", JSON.stringify(res.data.userId));
      })
<<<<<<< Updated upstream
      .then(() => {
        navigate("/meet");
=======
      .then(async () => {
        await callApi("get", "http://localhost:8080/api/user/guard/myinfo")
          .then(res => {
            localStorage.setItem("myId", JSON.stringify(res.data.userId));
            console.log(res.data);
          })
          .catch(err => console.log(err));
        // await navigate("/meet");
      })
      .catch(err => {
        console.log(err);
>>>>>>> Stashed changes
      });
  };
  useEffect(() => {
    KakaologinHandler();
  }, []);
  return <Loading />;
};
export default KakaoLogin;
