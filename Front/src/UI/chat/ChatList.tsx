// 채팅방 목록을 보여줌
// 채팅방 목록을 클릭하면 채팅방으로 이동
// 채팅방 목록은 채팅방 이름, 채팅방 마지막 메시지, 채팅방 마지막 메시지 시간을 보여줌

import { useState, useEffect } from "react";
import styled from "styled-components";
import Chat from "./Chat";
import ChatDM from "./ChatDM";
import { meetingicon, directMessage } from "../../assets/AllIcon";
import Footer from "../footer/Footer";
import { callApi } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const Button = styled.button`
  flex-basis: 50%;
  height: 3rem;
  background-color: white;
  border: none;
`;

const ChatListDiv = styled.div`
  width:50%;
  height: 3rem;
  background-color: white;
  border: none;
  display: flex;
`;

const ChatList = () => {
  const [chatList, setChatList] = useState([]);
  const [chooseChat, setChooseChat] = useState(0); // 선택한 채팅방의 index
  const MeetingIcon = meetingicon(chooseChat === 0 ? "var(--c-black)" : "#AAAAAA");
  const navigate = useNavigate();
  const chatRoomDetail = (roomId: number) => {
    navigate(`/chatList/${roomId}`);
  };
  const chatDMRoomDetail = (user1: number, user2: number) => {
    navigate(`/directchat/${user1}/${user2}`);
  };
  const directMessageIcon = directMessage(chooseChat === 0 ? "#AAAAAA" : "var(--c-black)");

  const userId = localStorage.getItem("myId");
  const classListHandler = () => {
    callApi("GET", `api/chatroom/${userId}/getChatRoom`)
      .then(res => {
        console.log(res.data);
        setChatList(res.data);
      })
      .catch(e => {
        console.log(e);
      });
  };
  const dmListHandler = () => {
    callApi("GET", `api/dm/list/${userId}`)
      .then(res => {
        console.log(res.data);
        setChatList(res.data);
      })
      .catch(e => {
        console.log(e);
      });
  };
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  useEffect(() => {
    if (chooseChat === 0) {
      classListHandler();
    } else {
      dmListHandler();
    }
  }, [chooseChat]);
  return (
    <>
      <nav>
        <ChatListDiv>
          <Button
              onClick={() => {
                setChooseChat(0);
              }}
              style={{
                borderBottom: chooseChat === 0 ? "2px solid var(--c-black)" : "none",
              }}
          >
            {/*{MeetingIcon}*/}
            모임채팅
          </Button>
          <Button
              onClick={() => {
                setChooseChat(1);
              }}
              style={{
                borderBottom: chooseChat === 0 ? "none" : "2px solid var(--c-black)",
              }}
          >
            {/*{directMessageIcon}*/}
            채팅
          </Button>
        </ChatListDiv>
      </nav>
      <div style={{ padding: "1rem", backgroundColor: "var(--c-lightgray)", minHeight: "940px" }}>
        {chooseChat === 0
          ? chatList.map(chatRoom => {
              return (
                <Chat
                  key={chatRoom.chatRoomId}
                  chatRoomName={chatRoom.chatRoomName}
                  chatRoomId={chatRoom.chatRoomId}
                  chatRoomDetail={chatRoomDetail}
                />
              );
            })
          : chatList.map((chatRoom, i) => {
              return (
                <ChatDM
                  key={i}
                  chatRoomDetail={chatDMRoomDetail}
                  user1={chatRoom.user1}
                  user2={chatRoom.user2}
                />
              );
            })}
      </div>
      {/* <div style={{ height: "80px" }}></div> */}
      <footer>
        <Footer />
      </footer>
    </>
  );
};
export default ChatList;
