// 로그인 화면, 회원 가입을 누르면 Signup.tsx로 이동
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import logo from "../../assets/logo.png";
import CocktailGlass from "../../assets/Loading/CocktailGlass.png";
import NeighBrew from "../../assets/Login/NeighBrew.png"; // 이미지를 가져오는 경로를 정확하게 지정합니다.
import googleLogin from "../../assets/Login/googleLogin.png"; // 이미지를 가져오는 경로를 정확하게 지정합니다.
import icon from "../../assets/Login/icon.png"; // 이미지를 가져오는 경로를 정확하게 지정합니다.
import kakaoLogin from "../../assets/Login/kakaoLogin.png"; // 이미지를 가져오는 경로를 정확하게 지정합니다.
import naverLogin from "../../assets/Login/naverLogin.png"; // 이미지를 가져오는 경로를 정확하게 지정합니다.
import { callApi } from "../../utils/api";
<<<<<<< Updated upstream
=======
import naverLogin from "../../assets/Login/naverLogin.png"; // 이미지를 가져오는 경로를 정확하게 지정합니다.
import kakaoLogin from "../../assets/Login/kakaoLogin.png"; // 이미지를 가져오는 경로를 정확하게 지정합니다.
import googleLogin from "../../assets/Login/googleLogin.png"; // 이미지를 가져오는 경로를 정확하게 지정합니다.
import NeighBrew from "../../assets/Login/NeighBrew.png"; // 이미지를 가져오는 경로를 정확하게 지정합니다.
import icon from "../../assets/Login/icon.png"; // 이미지를 가져오는 경로를 정확하게 지정합니다.

const ImgDiv = styled.div`
  width: 20%;
  height: 30%;
  overflow: hidden;
  aspect-ratio: 1/1;
  border-radius: 50%;
  float: left;
  margin-right: 1rem;
`;
>>>>>>> Stashed changes

const ImgDivIcon = styled.div`
  overflow: hidden;
  aspect-ratio: 1/1;
  border-radius: 50%;
  float: left;
  margin-right: 1rem;
  position: relative;
  bottom: -1rem;
  z-index: 1;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Div = styled.div`
  display: flex;
  height: 70%;
  width: 70%;
  margin: 1rem 0;
  align-items: center;

  font-weight: 14px;
  font-family: "JejuGothic";
  font-size: 20px;
<<<<<<< Updated upstream

  cursor: pointer;
`;

const MintSection = styled.div`
=======
`;

const OrangeSection = styled.div`
>>>>>>> Stashed changes
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--c-yellow);
  width: 100%;
<<<<<<< Updated upstream
`;

const SubTitle = styled.div`
  margin-top: 5rem;
  font-family: "NanumSquareNeoBold";
  font-size: 14px;
=======
>>>>>>> Stashed changes
`;

const WhiteSection = styled.div`
  top: -3rem;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  width: 100%;
  border-radius: 50px 50px 0 0; /* 상단만 둥글게 처리 */
<<<<<<< Updated upstream
  padding-top: 6rem;
  font-family: "NanumSquareNeo";
  font-size: 1.15rem;
`;

const LoginBtnDiv = styled.div`
  width: 100%;
  align-items: center;
  display: flex;
  flex-direction: column;
  position: relative;
  top: 1rem;
`;

=======
`;

>>>>>>> Stashed changes
const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token") != null) {
      callApi("post", "api/user/refresh-token", {
        refreshToken: localStorage.getItem("refreshToken"),
      }).then((res) => {
        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        navigate("/meet");
      });
    }
  }, []);
  const KakaologinHandler = async () => {
    axios({
      method: "get",
<<<<<<< Updated upstream
      url: "/api/auth/login/kakao",
    }).then((res) => {
      const url = res.data.URL;
      window.location.href = url;
    });
=======
      url: "http://localhost:8080/api/auth/login/kakao",
    })
      .then(res => {
        const url = res.data.URL;
        window.location.href = url;
      })
      .catch(err => {
        console.log(err);
      });
>>>>>>> Stashed changes
  };
  const NaverloginHandler = async () => {
    axios({
      method: "get",
      url: "api/auth/login/naver",
    }).then((res) => {
      const url = res.data.URL;
      window.location.href = url;
    });
  };
  const GoogleloginHandler = async () => {
    axios({
      method: "get",
      url: "api/auth/login/google",
    }).then((res) => {
      const url = res.data.URL;
      window.location.href = url;
    });
  };
  useEffect(() => {
    localStorage.setItem("chooseMenu", "0");
  }, []);
<<<<<<< Updated upstream

  return (
    <div
      style={{ display: "flex", alignItems: "center", flexDirection: "column" }}
    >
      <MintSection>
        <SubTitle>주류 정보 공유 및 모임 플랫폼</SubTitle>
        <img src={logo} style={{ width: "50vw" }} />
        <ImgDivIcon>
          <img src={CocktailGlass} />
        </ImgDivIcon>
      </MintSection>
      <WhiteSection>
        <p>네이브루에 오신걸 환영합니다.</p>
        <LoginBtnDiv>
          <Div onClick={KakaologinHandler}>
            <Img src={kakaoLogin} />
          </Div>

          <Div onClick={NaverloginHandler}>
            <Img src={naverLogin} />
          </Div>

          <Div onClick={GoogleloginHandler}>
            <Img src={googleLogin} />
          </Div>
        </LoginBtnDiv>
=======
  return (
    <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
      <OrangeSection>
        <div style={{ marginBottom: "3rem" }}>
          <img src={NeighBrew} style={{ marginTop: "5rem" }} />
        </div>
        <div style={{ marginBottom: "9rem" }}>
          <p style={{ fontFamily: "Noto Sans KR", fontSize: "1.15rem" }}>
            네이브루에 오신걸 환영합니다.
          </p>
        </div>
      </OrangeSection>

      <WhiteSection>
        {/* 아이콘을 위치시킬 영역 */}
        <ImgDivIcon
          style={{
            position: "relative",
            top: "-4rem",
            zIndex: 1,
            borderRadius: "5rem 5rem 0 0",
          }}
        >
          <img src={icon} />
        </ImgDivIcon>

        {/* <div style={{ position: "relative", top: "-2rem", zIndex: 1 }}> */}
        {/* <div>
        <img src={LoginImg} style={{ width: "5rem"}}  />
      </div> */}
        {/* </div> */}

        <div
          style={{
            width: "100%",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            top: "1rem",
          }}
        >
          <Div onClick={KakaologinHandler} style={{ cursor: "pointer", marginTop: "" }}>
            <Img src={kakaoLogin} />
          </Div>

          <Div onClick={NaverloginHandler} style={{ cursor: "pointer" }}>
            <Img src={naverLogin} />
          </Div>

          <Div onClick={GoogleloginHandler} style={{ cursor: "pointer" }}>
            <Img src={googleLogin} />
          </Div>
        </div>
>>>>>>> Stashed changes
      </WhiteSection>
    </div>
  );
};
export default Login;
