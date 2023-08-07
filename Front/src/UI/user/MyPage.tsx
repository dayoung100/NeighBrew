// 마이 페이지
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { meetingicon, brewery } from "../../assets/AllIcon";
import temgif from "../../assets/tempgif.gif";
import bottle from "../../assets/bottle.png";
import liver from "../../assets/liver.png";
import siren from "../../assets/siren.png";
import Navbar from "./Navbar";
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
    drinkcount: 0,
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
  const myDrinks = () => {
    callApi("get", `api/drink/user/${userid}/review-drink`).then((res) => {
      console.log(res.data);
      setUserData((userData) => ({ ...userData, drinkcount: res.data.length }));
    });
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
    if (parseInt(e.target.value.split("-")[0]) >= 2005) {
      alert("만 18세 이상만 이용 가능합니다");
      setBirth(birth);
      return;
    }
    setBirth(e.target.value);
  };
  const modalHandler = () => {
    setDeleteModalOn(true);
  };
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    refresh();
    userInfo();
    followers();
    myDrinks();
  }, []);

  const [imgFile, setImgFile] = useState(null);
  const imgRef = useRef<HTMLInputElement>(null);

  //이미지 파일 업로드 시 미리보기
  const saveImgFile = () => {
    const file = imgRef.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setImgFile(reader.result);
      }
    };
  };

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
        .then(() => {
          myDrinks();
        })
        .catch((err) => console.log(err));
    }
    if (userData.nickname != nickname && nickname.length > 10) {
      alert("닉네임이 길어 변경할 수 없습니다.");
      setNickname(userData.nickname);
      return;
    }
    if (intro == "" || nickname == "" || birth == "") {
      alert("빈 값이 존재합니다.");
      return;
    }
    if (
      userData.nickname == nickname &&
      userData.intro == intro &&
      userData.birth == birth
    )
      return;
    console.log(nickname, intro, birth);
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
      .then(() => {
        myDrinks();
      })
      .catch((err) => {
        if (err.response.data == "중복") {
          alert("중복된 닉네임입니다. 다시 입력해주세요.");
        }
      });
  };
  const reportHandler = () => {
    if (window.confirm("정말 신고 하시겠습니까?")) {
      alert("신고되었습니다..");
    } else {
    }
  };

  // DM 보내기
  const directMessageHandler = () => {
    navigate("/directchat/" + localStorage.getItem("myId") + "/" + userid);
  };

  return (
    <>
      <header>
        <Navbar modalHandler={modalHandler} userid={parseInt(userid)} />
      </header>
      <div
        style={{
          minHeight: "12.5rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <UserDiv>
          <FlexDivRow>
            <ImgDiv>
              <Img
                src={userData.profile == "no image" ? temgif : userData.profile}
              ></Img>
            </ImgDiv>
            <UserImgDiv>
              <p style={{ marginBottom: "0.5rem" }}>
                {userData!.liverPoint} IU/L
              </p>
              <LiverDiv liverpoint={userData!.liverPoint ?? 40}>
                <Img src={liver} alt="" />
              </LiverDiv>
              <p style={{ marginTop: "0.2rem" }}>간수치</p>
            </UserImgDiv>
            <UserImgDiv>
              <p style={{ marginBottom: "0.5rem" }}>{userData.drinkcount}병</p>
              <BottleDiv>
                <Img src={bottle} alt="" />
              </BottleDiv>
              <p style={{ marginTop: "0.2rem" }}>술병</p>
            </UserImgDiv>
          </FlexDivRow>
        </UserDiv>
        <p
          style={{
            textAlign: "left",
            marginLeft: "2rem",
            fontFamily: "SeoulNamsan",
            fontWeight: "800",
            fontSize: "1.3rem",
          }}
        >
          {userData.nickname}
        </p>
        <div
          style={{
            textAlign: "left",
            marginLeft: "2rem",
            fontSize: "0.8rem",
            fontFamily: "Jejugothic",
            marginBottom: "0.5rem",
          }}
        >
          <span onClick={goFollowPage}>
            팔로잉 {userData.following} &nbsp;&nbsp;{" "}
          </span>{" "}
          <span onClick={goFollowerPage}>팔로워 {userData.follower}</span>
        </div>
        <div
          style={{
            textAlign: "left",
            marginLeft: "2rem",
            fontSize: "0.8rem",
            marginBottom: "1rem",
          }}
        >
          <p>{userData.intro}</p>
        </div>
        <FollowDiv>
          <button
            style={{
              backgroundColor:
                following === 0 ? "var(--c-yellow)" : "var(--c-lightgray)",
              border: "none",
              borderRadius: ".5rem",
              fontFamily: "JejuGothic",
              cursor: "pointer",
              width: "40%",
              margin: "0 1rem",
            }}
            onClick={followHandler}
          >
            {following === 0 ? "팔로우" : "언팔로우"}
          </button>
          <button
            style={{
              border: "none",
              borderRadius: ".5rem",
              fontFamily: "JejuGothic",
              cursor: "pointer",
              width: "40%",
            }}
            onClick={directMessageHandler}
          >
            메세지
          </button>
          <SirenArea onClick={reportHandler}></SirenArea>
        </FollowDiv>
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
      {/* Footer에 의해 가려지는게 없게 하기위해 존재하는 div */}
      <div style={{ height: "3rem" }}></div>
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
        <QuestionDiv style={{ textAlign: "left", marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Title style={{ margin: "0" }}>프로필 이미지</Title>
            <ImgInput>
              <label htmlFor="img_file">
                <img
                  src="/src/assets/imageButton.svg"
                  style={{ margin: "0 0.5rem" }}
                />
              </label>
              <input
                type="file"
                id="img_file"
                accept="image/jpg, image/png, image/jpeg"
                onChange={saveImgFile}
                ref={imgRef}
              />
            </ImgInput>
          </div>
          {imgFile && <ImageArea src={imgFile}></ImageArea>}
        </QuestionDiv>
        <Button
          onClick={() => {
            changeUserInfo();
            setDeleteModalOn(false);
          }}
          style={{
            backgroundColor: "var(--c-yellow)",
            color: "var(--c-black)",
            borderRadius: ".5rem",
            marginBottom: "1rem",
          }}
        >
          유저 정보 변경
        </Button>
        <br />
        <Button
          onClick={() => {
            setDeleteModalOn(false);
            localStorage.removeItem("token");
            localStorage.removeItem("myId");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("chooseMenu");
            navigate("/");
          }}
          style={{
            backgroundColor: "var(--c-lightgray)",
            color: "var(--c-black)",
            borderRadius: ".5rem",
          }}
        >
          로그아웃
        </Button>
      </Modal>
      <Footer />
    </>
  );
};

export default MyPage;
const QuestionDiv = styled.div`
  margin-top: 1.5rem;
`;

const Title = styled.div`
  font-family: "JejuGothic";
  font-size: 1.25rem;
  text-align: left;
  margin-bottom: 0.5rem;
`;

const ImgInput = styled.div`
  // label로 대신하고 input은 숨기기 위한 css
  input[type="file"] {
    position: absolute;
    width: 0;
    height: 0;
    padding: 0;
    margin: -0.0625rem;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }
`;

const ImageArea = styled.div<{ src: string }>`
  background: url(${(props) => props.src}) no-repeat center;
  background-size: cover;
  border-radius: 50%;
  position: relative;
  width: 30%;
  padding-bottom: 30%;
  overflow: hidden;
`;
const SirenArea = styled.div`
  background: url("/src/assets/siren.png") no-repeat center;
  background-size: cover;
  border-radius: 50%;
  /* position: relative; */
  width: 6%;
  padding-bottom: 6%;
  overflow: hidden;
  margin-left: 0.7rem;
`;
// user 이미지, 간수치, 술장이 들어갈 div
const FlexDivRow = styled.div`
  /* width: 100%; */
  display: flex;
  padding: 0.5rem;
  align-items: center;
`;

const FollowDiv = styled.div`
  display: flex;
  width: 100%;
  height: 1.5rem;
  margin-bottom: 1rem;
  /* min-height: 1rem; */
`;
// 간수치, 주종이 들어갈 imgdiv
const UserImgDiv = styled.div`
  width: 25%;
  height: 100%;
  min-height: 5rem;
  max-height: 6rem;
  min-width: 3rem;
  object-fit: cover;
  max-width: 4rem;
  overflow: hidden;
  padding: 0.5rem;
  margin: 0 0.5rem;
  background-color: var(--c-lightgray);
  border-radius: 1rem;
  font-size: 0.75rem;
  font-family: "JejuGothic";
  font-weight: 500;
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

const ImgDiv = styled.div`
  width: 30%;
  height: 50%;
  overflow: hidden;
  min-width: 8rem;
  aspect-ratio: 1/1;
  border-radius: 50%;
  float: left;
  margin-right: 4rem;
  /* margin: 0 1rem; */
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
  margin-bottom: 0.5rem;
`;

// 간수치, 술병 등의 div
const LiverDiv = styled.div<{ liverpoint: number }>`
  /* position: relative; */
  /* height: 100%; */
  overflow: hidden;
  background-image: linear-gradient(to top, #e591a1 50%, #ececec 50%);
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

  aspect-ratio: 1.2/1; /* Added to set the aspect ratio to 1:1 */
  display: flex;
  align-items: center;
  justify-content: center;
`;
const BottleDiv = styled.div<{}>`
  /* position: relative; */
  /* height: 100%; */
  overflow: hidden;
  background-image: linear-gradient(to top, #d5a002 50%, #ececec 50%);
  /* background-size: ${(props) => "50% " + (props.liverpoint + 80) + "%"}; */
  background-size: 20% 80%;
  animation: fillAnimation 5s forwards;
  @keyframes fillAnimation {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 0 100%;
    }
  }

  aspect-ratio: 1.2/1; /* Added to set the aspect ratio to 1:1 */
  display: flex;
  align-items: center;
  justify-content: center;
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
