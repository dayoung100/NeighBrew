// 채팅방 목록을 보여줌
// 채팅방 목록을 클릭하면 채팅방으로 이동
// 채팅방 목록은 채팅방 이름, 채팅방 마지막 메시지, 채팅방 마지막 메시지 시간을 보여줌

import { useState, useEffect } from "react";
import styled from "styled-components";
import Chat from "./Chat";
import { meetingicon, directMessage } from "../../assets/AllIcon";

const Button = styled.button`
  width: 40%;
  display: inline-block;
  height: 3rem;
  background-color: white;
  border: none;
  margin: 1rem auto;
  &:focus {
    outline: none;
    border-bottom: 2px solid #000000;
  }
`;

const ChatList = () => {
  const [chatList, setChatList] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [directChatList, setdirectChatList] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [chooseChat, setChooseChat] = useState(0); // 선택한 채팅방의 index
  const MeetingIcon = meetingicon(chooseChat === 0 ? "black" : "#AAAAAA");
  const directMessageIcon = directMessage(chooseChat === 0 ? "#AAAAAA" : "black");
  return (
    <>
      <div>
        <Button
          onClick={() => {
            setChooseChat(0);
          }}
          autoFocus
        >
          {MeetingIcon}
        </Button>
        <Button
          onClick={() => {
            setChooseChat(1);
          }}
        >
          {directMessageIcon}
        </Button>
      </div>

      {chooseChat === 0
        ? chatList.map((chat, i) => {
            return <Chat key={i} chooseChat={chooseChat}></Chat>;
          })
        : directChatList.map((chat, i) => {
            return <Chat key={i} chooseChat={chooseChat}></Chat>;
          })}
    </>
  );
};
export default ChatList;
