// 마이 페이지
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { meetingicon, directMessage, brewery } from "../../assets/AllIcon";
import temgif from "../../assets/tempgif.gif";
import bottle from "../../assets/bottle.png";
import liver from "../../assets/liver.png";
import siren from "../../assets/siren.png";
import Navbar from "../navbar/Navbar";
import MeetingMy from "../meet/MeetingMy";

const Button = styled.button`
  width: 40%;
  display: inline-block;
  height: 3rem;
  background-color: white;
  border: none;
  font-size: 12px;
  font-family: "JejuGothic";
  /* margin: 1rem auto; */
`;

const Div = styled.div`
  width: 100%;
  background-color: var(--c-lightgray);
  min-height: 800px;
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
  /* height: 180px; */
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin-bottom: 1rem;
`;

// 간수치, 술병 등의 div
const ColumnDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
  font-size: 14px;
  align-items: center;
  font-size: 14px;
  font-family: "JejuGothic";
`;
const GripDiv = styled.div`
  display: grid;
  /* grid-template-columns: 1fr 1fr; */
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 2fr 1fr;
  font-size: 14px;
  font-family: "JejuGothic";
`;
const UserInfoDiv = styled.div`
  display: flex;
  font-size: 14px;
  font-family: "JejuGothic";
  margin-bottom: 1rem;
  align-items: center;
`;
const TagDiv = styled.div`
  border-radius: 16px;
  background-color: var(--c-yellow);
  margin: auto 0.5rem;
  padding: 0.3rem;
`;
const LiverDiv = styled.div<{ liverIU: number }>`
  position: relative;
  height: 100%;
  background-image: linear-gradient(to top, #e24965 50%, #fff 50%);
  background-size: ${props => "50% " + (props.liverIU + 80) + "%"};
  /* background-size: 50% 150%; */
  animation: fillAnimation 3s forwards;
  @keyframes fillAnimation {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 0 100%;
    }
  }
`;
const MyPage = () => {
  const [userData, setUserData] = useState<(string | number)[]>(["이름", "나이", 1]); // 유저 정보
  const [chooseChat, setChooseChat] = useState(0); // 선택한 채팅방의 index
  const [following, setFollowing] = useState(0); // 팔로잉 목록
  const [liverIU, setLiverIU] = useState(40); // 간수치
  const { userid } = useParams();
  const [tags, setTags] = useState(["태그1", "태그2", "태그3"]);
  const MeetingIcon = meetingicon(chooseChat === 0 ? "var(--c-black)" : "#AAAAAA");
  const Brewery = brewery(chooseChat === 0 ? "#AAAAAA" : "var(--c-black)");
  const followHandler = () => {
    setFollowing(prev => {
      return prev === 0 ? 1 : 0;
    });
  };
  return (
    <>
      <header>
        <Navbar />
      </header>
      <div
        style={{
          minHeight: "200px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <UserDiv>
          <ImgDiv>
            <Img src={temgif}></Img>
          </ImgDiv>
          <ColumnDiv>
            <p>{liverIU} IU/L</p>
            <LiverDiv liverIU={liverIU}>
              <img style={{ width: "38px", height: "38px" }} src={liver} alt="" />
            </LiverDiv>
            <p>간수치</p>
          </ColumnDiv>
          <ColumnDiv>
            <p>4병</p>
            <img style={{ width: "16.107px", height: "38.071px" }} src={bottle} alt="" />
            <p>술병수</p>
          </ColumnDiv>
          <GripDiv>
            <ColumnDiv
              style={{
                gridColumn: "1/3",
                gridRow: "1/3",
              }}
            >
              <p>100</p>
              <p>팔로우</p>
            </ColumnDiv>
            <ColumnDiv
              style={{
                gridColumn: "3/5",
                gridRow: "1/3",
              }}
            >
              <p>100</p>
              <p>팔로워</p>
            </ColumnDiv>
            <button
              style={{
                gridColumn: "1/4",
                gridRow: "3/3",
                backgroundColor: following === 0 ? "var(--c-yellow)" : "var(--c-lightgray)",
                border: "none",
                borderRadius: "16px",
                fontFamily: "JejuGothic",
                cursor: "pointer",
              }}
              onClick={followHandler}
            >
              {following === 0 ? "팔로우" : "언팔로우"}
            </button>

            <img src={siren} style={{ gridColumn: "4/5", gridRow: "3/3", cursor: "pointer" }} />
          </GripDiv>
        </UserDiv>

        <UserInfoDiv>
          <p style={{ marginLeft: "3rem", marginRight: "4rem" }}>{userData[0]}</p>
          {tags.map(tag => {
            return <TagDiv>{tag}</TagDiv>;
          })}
        </UserInfoDiv>
        <div
          style={{
            fontSize: "14px",
            fontFamily: "JejuGothic",
            textAlign: "left",
            margin: "0 1rem",
          }}
        >
          <p>한줄 설명 : 한줄 설명에는 뭘 넣을 까요????</p>
        </div>
      </div>
      <div>
        <Button
          onClick={() => {
            setChooseChat(0);
          }}
          style={{
            borderBottom: chooseChat === 0 ? "2px solid var(--c-black)" : "none",
          }}
        >
          {MeetingIcon}
          <p style={{ color: chooseChat === 0 ? "var(--c-black)" : "var(--c-lightgray)" }}>모임</p>
        </Button>
        <Button
          onClick={() => {
            setChooseChat(1);
          }}
          style={{ borderBottom: chooseChat === 0 ? "none" : "2px solid var(--c-black)" }}
        >
          {Brewery}
          <p style={{ color: chooseChat === 0 ? "var(--c-lightgray)" : "var(--c-black)" }}>술장</p>
        </Button>
      </div>
      {chooseChat === 0 ? <MeetingMy></MeetingMy> : <p>임시 술장</p>}

      {/* <Div>
        <p>awdawd</p>
      </Div> */}
    </>
  );
};

export default MyPage;
