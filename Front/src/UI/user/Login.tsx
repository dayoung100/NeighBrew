// 로그인 화면, 회원 가입을 누르면 Signup.tsx로 이동
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { callApi } from "../../utils/api";

const ImgDiv = styled.div`
  width: 20%;
  height: 30%;
  overflow: hidden;
  aspect-ratio: 1/1;
  border-radius: 50%;
  float: left;
  margin-right: 1rem;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const SocialDiv = styled.div`
  display: flex;
  width: 80%;
  height: 50%;
  min-height: 350px;
  flex-direction: column;
`;

const Div = styled.div`
  display: flex;
  height: 70%;
  width: 100%;
  margin: 1rem 0;
  align-items: center;
  border-radius: 12px;
  border: 2px solid #b2afaf;
  font-weight: 14px;
  font-family: "JejuGothic";
  font-size: 20px;
  box-shadow: 10px 5px 5px black;
`;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (localStorage.getItem("token") != null) {
      callApi("post", "api/user/refresh-token", {
        refreshToken: localStorage.getItem("refreshToken"),
      }).then(res => {
        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        navigate("/meet");
      });
    }
  }, []);
  const KakaologinHandler = async () => {
    axios({
      method: "get",
      url: "api/auth/login/kakao",
    })
      .then(res => {
        const url = res.data.URL;
        window.location.href = url;
      })
      .catch(err => {
        console.log(err);
      });
  };
  const NaverloginHandler = async () => {
    axios({
      method: "get",
      url: "api/auth/login/naver",
    })
      .then(res => {
        const url = res.data.URL;
        window.location.href = url;
      })
      .catch(err => {
        console.log(err);
      });
  };
  const GoogleloginHandler = async () => {
    axios({
      method: "get",
      url: "api/auth/login/google",
    })
      .then(res => {
        const url = res.data.URL;
        window.location.href = url;
      })
      .catch(err => {
        console.log(err);
      });
  };
  console.log(import.meta.env.VITE_API_BASE_URL);
  return (
    <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
      <h2>로그인</h2>
      <SocialDiv>
        <Div>
          <ImgDiv onClick={NaverloginHandler} style={{ cursor: "pointer" }}>
            <Img src="https://image.rocketpunch.com/company/5466/naver_logo.png?s=400x400&t=inside" />
          </ImgDiv>
          <p>네이버 로그인</p>
        </Div>
        <Div>
          <ImgDiv onClick={KakaologinHandler} style={{ cursor: "pointer" }}>
            <Img src="https://cdn.imweb.me/thumbnail/20220403/a8e484f2dfe39.png" />
          </ImgDiv>
          <p>카카오 로그인</p>
        </Div>
        <Div>
          <ImgDiv onClick={GoogleloginHandler} style={{ cursor: "pointer" }}>
            <Img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/800px-Google_%22G%22_Logo.svg.png" />
          </ImgDiv>
          <p>구글 로그인</p>
        </Div>
      </SocialDiv>
      <div></div>
    </div>
  );
};
export default Login;
