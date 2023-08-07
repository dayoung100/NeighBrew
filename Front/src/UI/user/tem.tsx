// 마이 페이지
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { meetingicon, brewery } from "../../assets/AllIcon";
import temgif from "../../assets/tempgif.gif";
import bottle from "../../assets/bottle.png";
import liver from "../../assets/liver.svg";
import siren from "../../assets/siren.png";
import Navbar from "../navbar/Navbar";
import MeetingMy from "./MeetingMyUseInUser";
import Footer from "../footer/Footer";
import Modal from "react-modal";
import { User } from "../../Type/types";
import { callApi } from "../../utils/api";
import DrinkpostMain from "./DrinkPostUseInUser";
import ImageInput from "../components/ImageInput";
import axios from "axios";

const MyPage = () => {
  const [userData, setUserData] = useState<User>({
    birth: "생년월일",
    email: "이메일",
    follower: 0,
    following: 0,
    liverPoint: 0,
    name: "이름",
    profile: "한줄설명",
    userId: 0,
    nickname: "닉네임",
  }); // 유저 정보
  const [chooseChat, setChooseChat] = useState(0); // 선택한 채팅방의 index
  const [following, setFollowing] = useState(0); // 팔로잉,팔로워 목록
  const { userid } = useParams();
  const MeetingIcon = meetingicon(
    chooseChat === 0 ? "var(--c-black)" : "#AAAAAA"
  );
  const Brewery = brewery(chooseChat === 0 ? "#AAAAAA" : "var(--c-black)");
  const [deleteModalOn, setDeleteModalOn] = useState(false);
  const [nickname, setNickname] = useState("");
  const [profile, setProfile] = useState("");
  const [intro, setIntro] = useState("");
  const [birth, setBirth] = useState("");
  const navigate = useNavigate();
  // 팔로우 하기
  const followHandler = async () => {
    const api = await callApi("post", `api/follow/guard/${userid}`)
      .then((res) => {
        followers();
      })
      .catch((err) => console.log(err));
  };
  // 팔로워, 팔로잉 인원 수 세기 (팔로우 버튼 색깔 변경)
  const followers = async () => {
    callApi("get", `api/follow/follower/${userid}`).then((res) => {
      if (res.data.length == 0) {
        setUserData((userData) => ({ ...userData, follower: res.data.length }));
        setFollowing(0);
        return;
      }
      setUserData((userData) => ({ ...userData, follower: res.data.length }));
      res.data.map((item, i) => {
        if (item.follower.userId == parseInt(localStorage.getItem("myId"))) {
          setFollowing(1);
          return;
        } else if (i == res.data.length - 1) {
          setFollowing(0);
        }
      });
    });
    callApi("get", `api/follow/following/${userid}`).then((res) => {
      setUserData((userData) => ({ ...userData, following: res.data.length }));
    });
  };

  const reportHandler = () => {
    alert("신고되었습니다.");
  };
  const goFollowerPage = () => {
    navigate("/myPage/follower/" + userid);
  };
  const goFollowPage = () => {
    navigate("/myPage/follow/" + userid);
  };
  const userInfo = () => {
    callApi("get", `api/user/${userid}`)
      .then((res) => {
        setUserData(res.data);
        console.log(res.data);
      })
      .then(() => {
        setBirth(userData.birth == null ? "2003-01-01" : userData.birth);
      })
      .catch((err) => console.log(err));
  };
  const refresh = () => {
    if (localStorage.getItem("token") != null) {
      callApi("post", "api/user/refresh-token", {
        refreshToken: localStorage.getItem("refreshToken"),
      }).then((res) => {
        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
      });
    }
  };

  useEffect(() => {
    setNickname(userData.nickname);
    setProfile(userData.profile);
    setIntro(userData.intro);
    setBirth(userData.birth ? userData.birth : birth);
  }, [userData]);
  const nicknameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setNickname(e.target.value);
  };
  const introHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIntro(e.target.value);
  };
  const birthHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setBirth(e.target.value);
  };
  useEffect(() => {
    refresh();
    userInfo();
    followers();
  }, []);

  const imgRef = useRef<HTMLInputElement>(null);

  const changeUserInfo = () => {
    const file = imgRef.current.files[0];
    const formData = new FormData();
    formData.append("profile", file);
    if (file !== undefined) {
      axios
        .put("/api/user/guard/img", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          userInfo();
        })
        .then(() => {
          followers();
        })
        .catch((err) => console.log(err));
    }
    if (
      userData.nickname == nickname &&
      userData.intro == intro &&
      userData.birth == birth
    )
      return;
    callApi("put", "api/user/guard", {
      nickname: nickname,
      intro: intro,
      birth: birth,
    })
      .then((res) => {
        userInfo();
      })
      .then(() => {
        followers();
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <header>
        <Navbar />
      </header>
      <div
        style={{
          minHeight: "12.5rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <UserDiv>
          <ImgDiv>
            <Img
              src={userData.profile == "no image" ? temgif : userData.profile}
            ></Img>
          </ImgDiv>
          <ColumnDiv>
            <p>{userData!.liverPoint} IU/L</p>
            <LiverDiv liverpoint={userData!.liverPoint}>
              <img src={liver} alt="" />
            </LiverDiv>
            <p>간수치</p>
          </ColumnDiv>
          <ColumnDiv>
            <p>4병</p>
            <img
              style={{ width: "1.0067rem", height: "2.3794rem" }}
              src={bottle}
              alt=""
            />
            <p>술병수</p>
          </ColumnDiv>
          <GripDiv>
            <ColumnDiv
              style={{
                gridColumn: "1/3",
                gridRow: "1/3",
                cursor: "pointer",
              }}
              onClick={goFollowPage}
            >
              <p>{userData.following ?? 0}</p>
              <p>팔로우</p>
            </ColumnDiv>
            <ColumnDiv
              style={{
                gridColumn: "3/5",
                gridRow: "1/3",
                cursor: "pointer",
              }}
              onClick={goFollowerPage}
            >
              <p>{userData.follower ?? 0}</p>
              <p>팔로워</p>
            </ColumnDiv>
            <button
              style={{
                gridColumn: "1/4",
                gridRow: "3/3",
                backgroundColor:
                  following === 0 ? "var(--c-yellow)" : "var(--c-lightgray)",
                border: "none",
                borderRadius: "1rem",
                fontFamily: "JejuGothic",
                cursor: "pointer",
              }}
              onClick={followHandler}
            >
              {following === 0 ? "팔로우" : "언팔로우"}
            </button>

            <img
              src={siren}
              style={{ gridColumn: "4/5", gridRow: "3/3", cursor: "pointer" }}
              onClick={reportHandler}
            />
          </GripDiv>
        </UserDiv>

        <UserInfoDiv>
          <p style={{ marginLeft: "3rem", marginRight: "4rem" }}>
            {userData!.nickname}
          </p>
        </UserInfoDiv>
        <div
          style={{
            fontSize: ".875rem",
            fontFamily: "JejuGothic",
            textAlign: "left",
            margin: "0 1rem",
            display: "flex",
          }}
        >
          <p>{userData.intro ?? "한 줄 소개를 설정해 주세요"}</p>
          <button
            onClick={() => {
              setDeleteModalOn(true);
            }}
          >
            프로필 수정
          </button>
        </div>
      </div>
      <div>
        <Button
          onClick={() => {
            setChooseChat(0);
          }}
          style={{
            borderBottom:
              chooseChat === 0 ? ".125rem solid var(--c-black)" : "none",
          }}
        >
          {MeetingIcon}
          <p
            style={{
              color: chooseChat === 0 ? "var(--c-black)" : "var(--c-lightgray)",
            }}
          >
            모임
          </p>
        </Button>
        <Button
          onClick={() => {
            setChooseChat(1);
          }}
          style={{
            borderBottom:
              chooseChat === 0 ? "none" : ".125rem solid var(--c-black)",
          }}
        >
          {Brewery}
          <p
            style={{
              color: chooseChat === 0 ? "var(--c-lightgray)" : "var(--c-black)",
            }}
          >
            술장
          </p>
        </Button>
      </div>
      {chooseChat === 0 ? (
        <MeetingMy userId={parseInt(userid)}></MeetingMy>
      ) : (
        <DrinkpostMain></DrinkpostMain>
      )}

      <div style={{ height: "5rem" }}></div>
      <Modal
        isOpen={deleteModalOn}
        onRequestClose={() => setDeleteModalOn(false)}
        style={WhiteModal}
        ariaHideApp={false}
      >
        <FlexDiv>
          <label htmlFor="nickname">닉네임</label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onInput={nicknameHandler}
          />
        </FlexDiv>
        <FlexDiv>
          <label htmlFor="intro">한줄 설명</label>
          <input type="text" id="intro" value={intro} onInput={introHandler} />
        </FlexDiv>
        <FlexDiv>
          <label htmlFor="date">생년월일</label>
          <input
            type="date"
            id="date"
            value={birth}
            onInput={birthHandler}
            max="2005-01-01"
          />
        </FlexDiv>
        <button
          onClick={() => {
            changeUserInfo();
            setDeleteModalOn(false);
          }}
        >
          유저 정보 변경
        </button>
        <input type="file" ref={imgRef} />
      </Modal>
      <footer>
        <Footer />
      </footer>
    </>
  );
};

export default MyPage;

const CateDiv = styled.div`
  height: 10rem;
  margin-top: 1rem;
  div {
    margin: 0;
  }
  .first,
  .second {
    display: flex;
    justify-content: space-around;
    margin-top: 0.5rem;
  }
`;
const Button = styled.button`
  width: 40%;
  display: inline-block;
  height: 3rem;
  background-color: white;
  border: none;
  font-size: 0.75rem;
  font-family: "JejuGothic";
  /* margin: 1rem auto; */
`;

const Div = styled.div`
  width: 100%;
  background-color: var(--c-lightgray);
  min-height: 50rem;
`;

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

const UserDiv = styled.div`
  width: 100%;
  /* height: 11.25rem; */
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin-bottom: 1rem;
`;

// 간수치, 술병 등의 div
const ColumnDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  font-size: 0.875rem;
  align-items: center;
  font-size: 0.875rem;
  font-family: "JejuGothic";
`;
const GripDiv = styled.div`
  display: grid;
  /* grid-template-columns: 1fr 1fr; */
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 2fr 1fr;
  font-size: 0.875rem;
  font-family: "JejuGothic";
`;
const UserInfoDiv = styled.div`
  display: flex;
  font-size: 0.875rem;
  font-family: "JejuGothic";
  margin-bottom: 1rem;
  align-items: center;
`;
const TagDiv = styled.div`
  border-radius: 1rem;
  background-color: var(--c-yellow);
  margin: auto 0.5rem;
  padding: 0.3rem;
  font-size: 0.75rem;
  width: 4rem;
`;
const LiverDiv = styled.div<{ liverpoint: number }>`
  position: relative;
  height: 100%;
  background-image: linear-gradient(to top, #e24965 50%, #fff 50%);
  background-size: ${(props) => "50% " + (props.liverpoint + 80) + "%"};
  /* background-size: 50% 150%; */
  animation: fillAnimation 5s forwards;
  @keyframes fillAnimation {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 0 100%;
    }
  }
`;
const WhiteModal = {
  content: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    height: "80%",
    padding: "0.5rem 1rem",
    borderRadius: ".9375rem",
    background: "white",
    textAlign: "center",
    fontFamily: "SeoulNamsan",
  },
  overlay: {
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: "11",
  },
};

const FlexDiv = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin: 1rem auto;
`;
