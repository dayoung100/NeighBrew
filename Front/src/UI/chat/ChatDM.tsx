// 채팅방 목록에서 보일 개별 채팅방 컴포넌트
import styled from "styled-components";
import tempimg from "../../assets/tempgif.gif";
import temimg from "../../assets/temgif.gif";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { callApi } from "../../utils/api";
import { User } from "../../Type/types";
import defaultImg from "../../assets/defaultImg.png";

const ChatDiv = styled.div`
  padding: 0.3rem;
  min-height: 5rem;
  /* height: 12rem; */
  width: 95%;
  margin: 0.5rem auto;
  border-radius: 15px;
  background-color: #ffffff;
  /* border: 1px solid var(--c-gray); */
  display: flex;
  text-align: left;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
`;
const ImgDiv = styled.div`
  width: 20%;
  height: 100%;
  overflow: hidden;
  /* inline-size: 25ch; */
  aspect-ratio: 1/1;
  border-radius: 50%;
  float: left;
  margin-right: 1rem;
  min-width: 50px;
  min-height: 50px;
  max-width: 50px;
  max-height: 50px;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Chat = (props: {
  user1: User;
  user2: User;
  chatRoomDetail(user1: number, user2: number): void;
  lastMessageTime: string;
}) => {
  const navigate = useNavigate();
  const [user1, setUsers1] = useState<User>({
    birth: "생년월일",
    email: "이메일",
    follower: 0,
    following: 0,
    liverPoint: 0,
    name: "이름",
    profile: "no image",
    userId: 0,
    nickname: "닉네임",
    drinkcount: 0,
  });
  const [user2, setUsers2] = useState<User>({
    birth: "생년월일",
    email: "이메일",
    follower: 0,
    following: 0,
    liverPoint: 0,
    name: "이름",
    profile: "no image",
    userId: 0,
    nickname: "닉네임",
    drinkcount: 0,
  });
  useEffect(() => {
    setUsers1(props.user1);
    setUsers2(props.user2);
  }, [props.user1, props.user2]);
  const [lastMessageTime, setLastMessageTime] = useState("");
  useEffect(() => {
    setLastMessageTime(
      props.lastMessageTime.split("T")[0].slice(5, 10) +
        "   " +
        props.lastMessageTime.split("T")[1].slice(0, 5)
    );
  });
  return (
    <ChatDiv onClick={() => props.chatRoomDetail(user1.userId, user2.userId)}>
      <ImgDiv>
        {user1 === undefined || user2 === undefined ? (
          <></>
        ) : (
          <Img
            src={
              user1.userId == parseInt(localStorage.getItem("myId"))
                ? user2.profile == "no image"
                  ? defaultImg
                  : user2.profile
                : user1.profile == "no image"
                ? defaultImg
                : user1.profile
            }
          ></Img>
        )}
      </ImgDiv>
      <div style={{}}>
        <div style={{ textAlign: "left" }}>
          <span
            style={{
              marginRight: "3px",
              fontSize: "14px",
              fontFamily: "JejuGothic",
            }}
          >
            {user1 === undefined || user2 === undefined
              ? null
              : user1?.userId == parseInt(localStorage.getItem("myId"))
              ? user2?.nickname
              : user1?.nickname}{" "}
            님과의 채팅
          </span>
          <span style={{ color: "var(--c-gray", fontSize: "12px", marginLeft: "0.5rem" }}>2</span>{" "}
          <p>{lastMessageTime}</p>
          <span></span>
        </div>
      </div>
    </ChatDiv>
  );
};
export default Chat;
