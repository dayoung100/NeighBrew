// 채팅방 목록을 보여줌
// 채팅방 목록을 클릭하면 채팅방으로 이동
// 채팅방 목록은 채팅방 이름, 채팅방 마지막 메시지, 채팅방 마지막 메시지 시간을 보여줌

import { useState, useEffect } from "react";
import styled from "styled-components";
import Chat from "./Chat";
import { meetingicon, directMessage } from "../../assets/AllIcon";
import Footer from "../footer/Footer";
import { callApi } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const Button = styled.button`
  width: 40%;
  display: inline-block;
  height: 3rem;
  background-color: white;
  border: none;
  margin: 1rem auto;
`;

const ChatList = () => {
  const [chatList, setChatList] = useState([]);
  const [chooseChat, setChooseChat] = useState(0); // 선택한 채팅방의 index
  const MeetingIcon = meetingicon(chooseChat === 0 ? "var(--c-black)" : "#AAAAAA");
  const navigate = useNavigate();

  const chatRoomDetail = (roomId: number) => {
    console.log(roomId);
    navigate(`/chatList/${roomId}`);
  };
  const directMessageIcon = directMessage(chooseChat === 0 ? "#AAAAAA" : "var(--c-black)");

  const userId = localStorage.getItem("myId");
  useEffect(() => {
    callApi("GET", `api/chatroom/${userId}/getChatRoom`)
<<<<<<< Updated upstream
      .then((res) => {
=======
      .then(res => {
>>>>>>> Stashed changes
        console.log(res.data);
        setChatList(res.data);
      })
      .catch(e => {
        console.log(e);
      });
  }, []);
  return (
    <>
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
          style={{
            borderBottom: chooseChat === 0 ? "none" : "2px solid var(--c-black)",
          }}
        >
          {directMessageIcon}
        </Button>
      </div>
      <div style={{ padding: "1rem", backgroundColor: "var(--c-lightgray)" }}>
        {chatList.map(chatRoom => {
          return (
            <Chat
              key={chatRoom.chatRoomId}
              chooseChat={chooseChat}
              chatRoomName={chatRoom.chatRoomName}
              chatRoomId={chatRoom.chatRoomId}
              chatRoomDetail={chatRoomDetail}
            />
          );
        })}
      </div>
      <div style={{ height: "80px" }}></div>
      <footer>
        <Footer />
      </footer>
    </>
  );
};
export default ChatList;
