// 마이 페이지
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { meetingicon, directMessage } from "../../assets/AllIcon";
import temgif from "../../assets/tempgif.gif";
import bottle from "../../assets/bottle.png";
import liver from "../../assets/liver.png";

const Button = styled.button`
  width: 40%;
  display: inline-block;
  height: 3rem;
  background-color: white;
  border: none;
  margin: 1rem auto;
`;

const Div = styled.div`
  width: 100%;
  background-color: var(--c-lightgray);
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
`;

// 간수치, 술병 등의 div
const ColumnDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
  font-size: 14px;
  align-items: center;
`;
const GripDiv = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;
const UserInfoDiv = styled.div`
  display: flex;
  font-size: 14px;
  font-family: "JejuGothic";
`;
const TagDiv = styled.div`
  border-radius: 16px;
  background-color: var(--c-yellow);
  margin: auto 0.5rem;
  padding: 0.3rem;
`;
const MyPage = () => {
  const [userData, setUserData] = useState<(string | number)[]>(["이름", "나이", 1]); // 유저 정보
  const [chooseChat, setChooseChat] = useState(0); // 선택한 채팅방의 index
  const { userid } = useParams();
  const [tags, setTags] = useState(["태그1", "태그2", "태그3"]);
  const MeetingIcon = meetingicon(chooseChat === 0 ? "var(--c-black)" : "#AAAAAA");
  const directMessageIcon = directMessage(chooseChat === 0 ? "#AAAAAA" : "var(--c-black)");
  return (
    <>
      <div
        style={{
          minHeight: "250px",
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
            <p>40 IU/L</p>
            <img style={{ width: "38px", height: "38px" }} src={liver} alt="" />
            <p>간수치</p>
          </ColumnDiv>
          <ColumnDiv>
            <p>4병</p>
            <img style={{ width: "16.107px", height: "38.071px" }} src={bottle} alt="" />
            <p>술병수</p>
          </ColumnDiv>
          <GripDiv>
            <ColumnDiv>
              <p>100</p>
              <p>팔로우</p>
            </ColumnDiv>
            <ColumnDiv>
              <p>100</p>
              <p>팔로워</p>
            </ColumnDiv>
            <button
              style={{
                gridColumn: "1/3",
                gridRow: "2/3",
              }}
            >
              팔로잉
            </button>
          </GripDiv>
        </UserDiv>

        <UserInfoDiv>
          <p style={{ marginLeft: "3rem", marginRight: "4rem" }}>{userData[0]}</p>
          {tags.map(tag => {
            return <TagDiv>{tag}</TagDiv>;
          })}
        </UserInfoDiv>
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
        </Button>
        <Button
          onClick={() => {
            setChooseChat(1);
          }}
          style={{ borderBottom: chooseChat === 0 ? "none" : "2px solid var(--c-black)" }}
        >
          {directMessageIcon}
        </Button>
      </div>
      <Div>
        <p>awdawd</p>
      </Div>
    </>
  );
};

export default MyPage;
