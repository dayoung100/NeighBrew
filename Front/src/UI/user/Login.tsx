// 로그인 화면, 회원 가입을 누르면 Signup.tsx로 이동
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { callApi } from "../../utils/api";
import naverLogin from "../../assets/Login/naverLogin.png"; // 이미지를 가져오는 경로를 정확하게 지정합니다.
import kakaoLogin from "../../assets/Login/kakaoLogin.png"; // 이미지를 가져오는 경로를 정확하게 지정합니다.
import googleLogin from "../../assets/Login/googleLogin.png"; // 이미지를 가져오는 경로를 정확하게 지정합니다.
import NeighBrew from "../../assets/Login/NeighBrew.png"; // 이미지를 가져오는 경로를 정확하게 지정합니다.
import icon from "../../assets/Login/icon.png"; // 이미지를 가져오는 경로를 정확하게 지정합니다.
import LoginImg from "../../assets/Login/Login.png"; // 이미지를 가져오는 경로를 정확하게 지정합니다.
import { registerServiceWorker } from "../../serviceWorker.js";

const ImgDiv = styled.div`
  width: 20%;
  height: 30%;
  overflow: hidden;
  aspect-ratio: 1/1;
  border-radius: 50%;
  float: left;
  margin-right: 1rem;
`;

const ImgDivIcon = styled.div`
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
  width: 70%;
  margin: 1rem 0;
  align-items: center;

  font-weight: 14px;
  font-family: "JejuGothic";
  font-size: 20px;
`;

const OrangeSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--c-yellow);
  width: 100%;
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
  useEffect(() => {
    localStorage.setItem("chooseMenu", "0");
    subscribe();
  }, []);
  const subscribe = () => {
    if (!("Notification" in window)) {
      // 브라우저가 Notification API를 지원하는지 확인한다.
      alert("알림을 지원하지 않는 데스크탑 브라우저입니다");
      return;
    }

    if (Notification.permission === "granted") {
      // 이미 알림 권한이 허가됐는지 확인한다.
      // 그렇다면, 알림을 표시한다.
      const notification = new Notification("안녕하세요!");
      return;
    }

    // 알림 권한이 거부된 상태는 아니라면
    if (Notification.permission !== "denied") {
      // 사용자에게 알림 권한 승인을 요청한다
      Notification.requestPermission().then(permission => {
        // 사용자가 승인하면, 알림을 표시한다
        if (permission === "granted") {
          const notification = new Notification("알림이 구독되었습니다");
        }
      });
    }
  };
  const noti = (message: string) => {
    navigator.serviceWorker.ready.then(registration => {
      const notiAlarm = registration.showNotification("알림", {
        body: "pinyin + '\n' + means",
        actions: [
          {
            title: "화면보기",
            action: "goTab",
          },
          {
            title: "닫기",
            action: "close",
          },
        ],
      });
    });
  };
  // const noti = navigator.serviceWorker.ready.then(function (registration) {
  //   const notiAlarm = registration.showNotification("알림", {
  //     body: "pinyin + '\n' + means",
  //     actions: [
  //       {
  //         title: "화면보기",
  //         action: "goTab",
  //       },
  //       {
  //         title: "닫기",
  //         action: "close",
  //       },
  //     ],
  //   });
  // });

  const followHandler = async () => {
    const api = await callApi("get", `api/push/follow/18`)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => console.log(err));
  };
  return (
    <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
      <button onClick={subscribe}>adwad</button>
      <button
        onClick={() => {
          noti("알림 테스트");
        }}
      >
        awdawdawd
      </button>
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
      </WhiteSection>
    </div>
  );
};
export default Login;
