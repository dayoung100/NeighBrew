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

const ChatListDiv = styled.div`
  display: flex;
  margin: 0 1rem;
  background-color: white;
  border-bottom: 1px solid var(--c-gray);
`;

const Button = styled.button`
  flex-basis: 50%;
  height: 3rem;
  background-color: white;
  border: none;
  font-family: "JejuGothic";
  font-size: 20px;
`;
const TopMenu = styled.div`
  height: 2rem;
  display: flex;
  margin: 0 0.5rem 0 0.5rem;
  background-color: white;
  border-bottom: 1px solid var(--c-gray);
`;
const TopMenuDetail = styled.button<{ isfocused: string }>`
  color: var(--${props => (props.isfocused === "true" ? "c-black" : "c-gray")});
  font-family: "JejuGothic";
  font-size: 20px;
  line-height: 150%;
  padding: 0 1rem;
  outline: none;
  border: none;
  border-bottom: ${props => (props.isfocused === "true" ? "2px solid var(--c-black);" : "none;")};
  background: white;
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
        setChatList(res.data);
      })
      .catch(e => {
        console.log(e);
      });
  };
  const dmListHandler = () => {
    callApi("GET", `api/dm/list/${userId}`)
      .then(res => {
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
  const [selectedMenu, setSelectedMenu] = useState("find");
  return (
    <>
      <ChatListDiv>
        <Button
          onClick={() => {
            setChooseChat(0);
          }}
          style={{
            borderBottom: chooseChat === 0 ? "2px solid var(--c-black)" : "none",
            color: chooseChat === 0 ? "var(--c-black)" : "var(--c-gray)",
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
            color: chooseChat === 1 ? "var(--c-black)" : "var(--c-gray)",
          }}
        >
          {/*{directMessageIcon}*/}
          채팅
        </Button>
      </ChatListDiv>
      <div style={{ padding: "1rem", backgroundColor: "var(--c-lightgray)", minHeight: "760px" }}>
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
