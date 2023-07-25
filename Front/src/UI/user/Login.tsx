// 로그인 화면, 회원 가입을 누르면 Signup.tsx로 이동
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const ImgDiv = styled.div`
  width: 20%;
  height: 50%;
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
  justify-content: space-between;
  height: 50%;
  min-height: 350px;
  align-items: center;
`;
const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const KakaologinHandler = async () => {
    axios({
      method: "get",
      url: "http://34.64.126.58/api/auth/login/kakao",
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
      url: "http://34.64.126.58/api/auth/login/naver",
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
      url: "http://34.64.126.58/api/auth/login/google",
    })
      .then(res => {
        const url = res.data.URL;
        window.location.href = url;
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
      <h2>로그인</h2>
      <SocialDiv>
        <ImgDiv onClick={NaverloginHandler} style={{ cursor: "pointer" }}>
          <Img src="https://image.rocketpunch.com/company/5466/naver_logo.png?s=400x400&t=inside" />
        </ImgDiv>
        <ImgDiv onClick={KakaologinHandler} style={{ cursor: "pointer" }}>
          <Img src="https://cdn.imweb.me/thumbnail/20220403/a8e484f2dfe39.png" />
        </ImgDiv>
        <ImgDiv onClick={GoogleloginHandler} style={{ cursor: "pointer" }}>
          <Img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/800px-Google_%22G%22_Logo.svg.png" />
        </ImgDiv>
      </SocialDiv>
      <div></div>
    </div>
  );
};
export default Login;
