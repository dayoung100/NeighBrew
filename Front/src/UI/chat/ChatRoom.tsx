import { useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Navbar from "../navbar/Navbar";
import { arrowLeftIcon, outRoom } from "../../assets/AllIcon";
import { useNavigate } from "react-router-dom";
import temgif from "../../assets/temgif.gif";
// const MessageBox = styled.div<{ messageId: number }>`
//   border-radius: ${props => (props.messageId === 1 ? "20px 20px 0px 20px" : "0px 20px 20px 20px")};
//   background-color: ${props => (props.messageId === 1 ? "#e5bcbc" : "#F0D389")};
//   /* max-width: 60%;
//   min-width: 40%; */
//   width: 60%;
//   padding: 1rem;
//   margin: 1rem auto;
//   display: inline-block;
//   position: relative;
//   right: ${props => (props.messageId === 0 ? "16%" : "-16%")};
//   word-break: break-all;
// `;
const MyChat = styled.div`
  position: relative;
  display: inline-block;
  background-color: #e06565;
  border-radius: 5px;
  padding: 10px;
  max-width: 60%;
  word-break: break-all;
  margin-bottom: 5px;
  margin-left: 1px;
  &::before {
    content: "";
    position: absolute;
    bottom: -5px;
    left: 0%;
    transform: translateX(-50%);
    border-style: solid;
    border-width: 10px 10px 0 10px;
    border-color: #e06565 transparent transparent transparent;
  }
`;
const OtherChat = styled.div`
  position: relative;
  display: inline-block;
  background-color: #e5bcbc;
  border-radius: 5px;
  padding: 10px;
  max-width: 60%;
  word-break: break-all;
  margin-bottom: 5px;
  margin-right: 1px;
  &:before {
    content: "";
    position: absolute;
    bottom: -5px;
    left: 100%;
    transform: translateX(-50%);
    border-style: solid;
    border-width: 10px 10px 0 10px;
    border-color: #e5bcbc transparent transparent transparent;
  }
`;
const ChatNav = styled.div`
  box-sizing: border-box;
  padding: 0.5rem;
  width: 100%;
  height: 3rem;
  background-color: var(--c-lightgray);
  display: flex;
  word-break: break-all;
  font-size: 0.9rem;
  align-items: center;
`;

const RightModal = styled.div<{ isModal: boolean }>`
  transform: ${props => (props.isModal ? "translateX(6%)" : "translateX(150%)")};
  position: fixed;
  width: 95%;
  overflow: hidden;
  height: 100vh;
  background-color: white;
  transition: all 0.5s ease-in-out;
  z-index: 11;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 2rem;
`;
const ImgDiv = styled.div`
  width: 15%;
  height: 100%;
  overflow: hidden;
  /* inline-size: 25ch; */
  aspect-ratio: 1/1;
  border-radius: 50%;
  float: left;
  margin-right: 2rem;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const UserDiv = styled.div`
  display: flex;
  margin-bottom: 1rem;
  font-size: 20px;
  font-family: "SeoulNamsan";
  width: 100%;
  vertical-align: middle;
  align-items: center;
`;

const InputDiv = styled.div`
  width: 100%;
  background-color: white;
  position: sticky;
  height: 2.5rem;
  box-sizing: border-box;
  margin-bottom: 3px;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

const Input = styled.input`
  width: 85%;
  height: 70%;
  border: 1px solid black;
  // border는 삭제예정
  border-radius: 3px;
`;
const ChatRoom = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState<[string, number][]>([
    ["메세지", 1],
    ["메세지", 0],
  ]);
  const [isModal, setIsModal] = useState(false);
  const [users, setUsers] = useState(["현욱", "현빈", "준서", "다영", "영교", "동혁"]);
  const [message, setMessage] = useState("");
  const messageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };
  const sendMessageHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter" || e.keyCode === 13) {
      if (message === "") return;
      setMessages(prev => [...prev, [message, 1]]);
      setMessage("");
      scroll();
    }
  };
  const navigate = useNavigate();
  const rapperDiv = useRef<HTMLInputElement>(null);
  const makedummy = () => {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < 10; i++) {
        setMessages(prev => {
          return [
            ...prev,
            ["메세awdawdkhjabkfhjbaskdbfk지", 1],
            ["메awdljawndljanwklujfnhaklfhklujashf세지", 0],
          ];
        });
      }
      resolve("ok");
    });
  };

  const scroll = () => {
    if (rapperDiv.current) {
      window.scrollTo({ top: rapperDiv.current.scrollHeight, behavior: "smooth" });
      console.log(window.screenTop);
    }
  };
  useEffect(() => {
    const foo = async () => {
      await makedummy();
      await scroll();
    };
    foo();
  }, []);
  const dummyAdd = () => {
    setMessages(prev => {
      return [...prev, ["메세지", 1], ["메세지", 0]];
    });
  };
  const ArrowLeftIcon = arrowLeftIcon();
  const OutRoom = outRoom();

  const OutRoomHandler = () => {
    navigate("/chatList");
  };
  const chaterInfoHandler = () => {
    isModal ? setIsModal(false) : setIsModal(true);
  };

  return (
    <>
      <header>
        <Navbar />
        <ChatNav>
          <div
            style={{
              marginRight: "2.6rem",
              marginLeft: "1rem",
              textAlign: "center",
              cursor: "pointer",
            }}
            onClick={OutRoomHandler}
          >
            {ArrowLeftIcon}
          </div>
          <span style={{ marginRight: "0.5rem", fontFamily: "JejuGothic", fontSize: "20px" }}>
            이런저런 ㅇㅇㅇㅇ방 이름
          </span>{" "}
          <span style={{ marginLeft: "0.5rem" }}>4</span>
          <div
            style={{ marginLeft: "3rem", marginTop: "3px", cursor: "pointer" }}
            onClick={chaterInfoHandler}
          >
            {OutRoom}
          </div>
        </ChatNav>
      </header>
      <RightModal isModal={isModal}>
        <h2 style={{ fontFamily: "JejuGothic" }}>모임의 이름이 들어갑니다</h2>
        <p style={{ fontFamily: "SeoulNamsan", marginBottom: "5px" }}>대전 서구 둔산동 연남</p>
        <p style={{ marginBottom: "10px", fontFamily: "SeoulNamsan" }}>2023.01.17 PM 8:00</p>
        <div style={{ border: "1px solid var(--c-lightgray)" }}></div>
        <br />
        <h3 style={{ fontFamily: "JejuGothic" }}>참여자 목록</h3>
        {users.map((user, i) => {
          return (
            <UserDiv key={i}>
              <ImgDiv>
                <Img src={temgif}></Img>
              </ImgDiv>
              <p>{user}</p>
            </UserDiv>
          );
        })}
        <div style={{ marginTop: "1rem" }}>
          <button onClick={OutRoomHandler}>채팅방 나가기</button>
        </div>
      </RightModal>
      <div
        ref={rapperDiv}
        style={{
          backgroundColor: isModal ? "#757575" : "var(--c-lightgray)",
          height: "100%",
          width: "100%",
          // maxWidth: "450px",
        }}
      >
        {messages.map((message, i) => {
          return (
            <div
              style={{
                display: "flex",
                alignItems: message[1] === 0 ? "flex-start" : "flex-end",
                flexDirection: "column",
              }}
            >
              <p style={{ fontFamily: "JejuGothic", fontSize: "12px", margin: "0 1rem" }}>나</p>
              {message[1] === 0 ? (
                <MyChat>{message[0]}</MyChat>
              ) : (
                <OtherChat>{message[0]}</OtherChat>
              )}
              {/* <MessageBox messageId={message[1]} key={i}>
                <p style={{ fontFamily: "JejuGothic", fontSize: "14px" }}>{message[0]}</p>
              </MessageBox> */}
            </div>
          );
        })}
        {/* </div> */}
        <div style={{ height: "5rem" }}></div>
      </div>
      <footer>
        <InputDiv>
          <p style={{ fontFamily: "JejuGothic", fontSize: "20px", fontWeight: "400" }}>+</p>
          <Input value={message} onChange={messageHandler} onKeyUp={sendMessageHandler}></Input>
          <button>awd</button>
        </InputDiv>
      </footer>
    </>
  );
};

export default ChatRoom;
