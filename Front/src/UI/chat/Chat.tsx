// 채팅방 목록에서 보일 개별 채팅방 컴포넌트
import styled from "styled-components";
import tempimg from "../../assets/tempgif.gif";
import temimg from "../../assets/temgif.gif";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { callApi } from "../../utils/api";

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
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Chat = (props: {
  chatRoomId: number;
  chatRoomName: string;
  chatRoomDetail(roomId: number): void;
}) => {
  const navigate = useNavigate();
  const [user, setUsers] = useState([]);
  useEffect(() => {
    callApi("GET", `/api/chatroom/${props.chatRoomId}/users`)
      .then(res => {
        setUsers(res.data);
      })
      .catch(e => {
        console.error(e);
      });
  }, []);
  return (
    <ChatDiv onClick={() => props.chatRoomDetail(props.chatRoomId)}>
      <ImgDiv>
        <Img src={temimg}></Img>
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
            채팅방 제목: {props.chatRoomName}
          </span>
          <span style={{ color: "var(--c-gray", fontSize: "12px", marginLeft: "0.5rem" }}>
            {user.length}
          </span>{" "}
          <span></span>
        </div>
        {/* <p
          style={{
            fontSize: "12px",
            fontFamily: "SeoulNamsan",
            marginTop: "6px",
          }}
        >
          10조 채팅방 입니다.
        </p> */}
      </div>
    </ChatDiv>
  );
};
export default Chat;
