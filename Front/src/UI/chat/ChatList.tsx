// 채팅방 목록을 보여줌
// 채팅방 목록을 클릭하면 채팅방으로 이동
// 채팅방 목록은 채팅방 이름, 채팅방 마지막 메시지, 채팅방 마지막 메시지 시간을 보여줌

import { useState, useEffect } from "react";
import styled from "styled-components";
import Chat from "./Chat";
import { meetingicon, directMessage } from "../../assets/AllIcon";
import Footer from "../footer/Footer";
import { callApi } from "../../utils/api";
import ChatRoom from "./ChatRoom";

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
  const [directChatList, setdirectChatList] = useState([]);
  const [chooseChat, setChooseChat] = useState(0); // 선택한 채팅방의 index
  const MeetingIcon = meetingicon(
    chooseChat === 0 ? "var(--c-black)" : "#AAAAAA"
  );
  const directMessageIcon = directMessage(
    chooseChat === 0 ? "#AAAAAA" : "var(--c-black)"
  );

  const userId = 1;
  useEffect(() => {
    const getChatList = async () => {
      const response = await callApi("GET", `api/chat/${userId}/getChatRoom`);
      setChatList(response.data);
    };
    getChatList();
  }, []);
  return (
    <>
      <div>
        <Button
          onClick={() => {
            setChooseChat(0);
          }}
          style={{
            borderBottom:
              chooseChat === 0 ? "2px solid var(--c-black)" : "none",
          }}
        >
          {MeetingIcon}
        </Button>
        <Button
          onClick={() => {
            setChooseChat(1);
          }}
          style={{
            borderBottom:
              chooseChat === 0 ? "none" : "2px solid var(--c-black)",
          }}
        >
          {directMessageIcon}
        </Button>
      </div>
      <div style={{ padding: "1rem", backgroundColor: "var(--c-lightgray)" }}>
        {chatList.map((chatRoom) => {
          return (
            <Chat
              key={chatRoom.chatRoomId}
              chooseChat={chooseChat}
              chatRoomName={chatRoom.chatRoomName}
            />
          );
        })}
        {/* {chooseChat === 0
          ? chatList.map((chat, i) => {
              return (
                <Chat key={i} chooseChat={chooseChat} chatRoomId={chat}></Chat>
              );
            })
          : directChatList.map((chat, i) => {
              return (
                <Chat
                  key={i}
                  choose_chat={chooseChat}
                  chat_room_id={chat}
                ></Chat>
              );
            })} */}
      </div>
      <div style={{ height: "80px" }}></div>
      <footer>
        <Footer />
      </footer>
    </>
  );
};
export default ChatList;
