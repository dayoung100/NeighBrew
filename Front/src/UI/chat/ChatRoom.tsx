import { useParams, useRouteError } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { arrowLeftIcon, outRoom } from "../../assets/AllIcon";
import { useNavigate } from "react-router-dom";
import temgif from "../../assets/temgif.gif";
import SockJS from "sockjs-client";
import { CompatClient, Stomp } from "@stomp/stompjs";
import { Chat } from "../../Type/types";
import { callApi } from "../../utils/api";

const MyChat = styled.div`
  position: relative;
  display: inline-block;
  background-color: #f0d389;
  border-radius: 12px;
  padding: 14px;
  max-width: 60%;
  word-break: break-all;
  margin-bottom: 5px;
  margin-left: 1px;
  font-size: 13px;
  text-align: left;
  font-family: "SeoulNamsan";
  &::before {
    content: "";
    position: absolute;
    bottom: -5px;
    left: 0%;
    transform: translateX(-50%);
    border-style: solid;
    border-width: 10px 10px 0 10px;
    border-color: #f0d389 transparent transparent transparent;
  }
`;
const OtherChat = styled.div`
  position: relative;
  display: inline-block;
  background-color: white;
  border-radius: 12px;
  padding: 14px;
  max-width: 60%;
  word-break: break-all;
  margin-bottom: 5px;
  margin-right: 1px;
  font-size: 13px;
  text-align: right;
  font-family: "SeoulNamsan";
  &:before {
    content: "";
    position: absolute;
    bottom: -5px;
    left: 100%;
    transform: translateX(-50%);
    border-style: solid;
    border-width: 10px 10px 0 10px;
    border-color: white transparent transparent transparent;
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
  justify-content: space-between;
`;

const RightModal = styled.div<{ isModal: boolean }>`
  transform: ${(props) =>
    props.isModal ? "translateX(6%)" : "translateX(100%)"};
  position: fixed;
  width: 95%;
  overflow-x: scroll;
  height: 100vh;
  background-color: white;
  transition: all 0.3s;
  z-index: 16;
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
  border: none;
  &:focus-visible {
    outline: none;
  }
`;

const BackDrop = styled.div<{ isModal: boolean }>`
  display: ${(props) => (props.isModal ? "block" : "none")};
  transition: all 1s;
  width: 100%;
  max-width: 430px;
  height: 10000px;
  position: fixed;
  z-index: 15;
  background-color: #322d29;
`;

const ChatRoom = () => {
  const { id } = useParams();
  const [sockjs, setSockjs] = useState();
  // const [client, setClient] = useState<any>(null);
  const client = useRef<CompatClient>();
  const [messages, setMessages] = useState<Chat[]>([]);
  const [isModal, setIsModal] = useState(false);
  const [chatRoomName, setChatRoomName] = useState();
  const userId = parseInt(localStorage.getItem("myId"));
  const [users, setUsers] = useState([
    "현욱",
    "현빈",
    "준서",
    "다영",
    "영교",
    "동혁",
  ]);
  const [message, setMessage] = useState("");
  const messageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };
  // 웹소켓 연결 및 이벤트 핸들러 설정
  const connectToWebSocket = () => {
    client.current = Stomp.over(() => {
      const ws = new SockJS("/ws");
      return ws;
    });

    client.current.connect({}, () => {
      console.log("Connect!!!!!!!!!!!!!!!!!!!!!!!");

      // 웹소켓 이벤트 핸들러 설정
      client.current!.subscribe(`/pub/room/${id}`, (res) => {
        console.log("New message", res);
        const receivedMessage = JSON.parse(res.body);
        setMessages((prevMessages: any) => [
          ...prevMessages,
          { message: receivedMessage.message, userid: receivedMessage.userId },
        ]);
      });
    });
  };

  useEffect(() => {
    connectToWebSocket();
  }, []);
  // 엔터 누르면 메세지 전송
  const sendMessageHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter" || e.keyCode === 13) {
      if (message === "") return;
      // 백엔드에 메시지 전송
      console.log(client);
      client.current.send(
        `/sub/chat/${id}/sendMessage`,
        {},
        JSON.stringify({ message: message, userId })
      );
      setMessage("");
      scroll();
    }
  };

  const navigate = useNavigate();
  const rapperDiv = useRef<HTMLInputElement>(null);

  // 채팅방 입장시 채팅 메시지 가져오기
  useEffect(() => {
    callApi("GET", `api/chatMessage/${id}/messages`)
      .then((res) => {
        console.log(res.data);
        setChatRoomName(res.data[0].chatRoom.chatRoomName);
        setMessages(res.data);
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

  // 방 입장 또는 메세지 보내면 스크롤 내려주는 로직
  useEffect(() => {
    scroll();
  }, [messages]);
  // 스크롤 로직
  const scroll = () => {
    if (rapperDiv.current) {
      window.scrollTo({
        top: rapperDiv.current!.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const foo = async () => {
      await scroll();
    };
    foo();
  }, []);

  const ArrowLeftIcon = arrowLeftIcon("black");
  const OutRoom = outRoom();

  const OutRoomHandler = () => {
    navigate("/chatList");
  };
  const chaterInfoHandler = () => {
    isModal ? setIsModal(false) : setIsModal(true);
  };

  return (
    <div ref={rapperDiv}>
      <header>
        {/* <Navbar /> */}
        <ChatNav>
          <div
            style={{
              marginRight: "0rem",
              marginLeft: "0rem",
              textAlign: "center",
              cursor: "pointer",
            }}
            onClick={OutRoomHandler}
          >
            {ArrowLeftIcon}
          </div>
          <span
            style={{
              marginRight: "0rem",
              fontFamily: "JejuGothic",
              fontSize: "20px",
            }}
          >
            <>
              {chatRoomName}
              <span style={{ fontSize: "14px", color: "var(--c-gray)" }}>
                &nbsp;&nbsp;&nbsp;&nbsp;4
              </span>
            </>
          </span>
          <div
            style={{ marginLeft: "0rem", marginTop: "3px", cursor: "pointer" }}
            onClick={chaterInfoHandler}
          >
            {OutRoom}
          </div>
        </ChatNav>
      </header>
      <BackDrop isModal={isModal} onClick={chaterInfoHandler}></BackDrop>
      <RightModal isModal={isModal}>
        <h2 style={{ fontFamily: "JejuGothic" }}>모임의 이름이 들어갑니다</h2>
        <p style={{ fontFamily: "SeoulNamsan", marginBottom: "5px" }}>
          대전 서구 둔산동 연남
        </p>
        <p style={{ marginBottom: "10px", fontFamily: "SeoulNamsan" }}>
          2023.01.17 PM 8:00
        </p>
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
        // ref={rapperDiv}
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
                alignItems: message.userid === 0 ? "flex-start" : "flex-end",
                flexDirection: "column",
              }}
            >
              <p
                style={{
                  fontFamily: "JejuGothic",
                  fontSize: "12px",
                  margin: "0 1rem",
                }}
              >
                나
              </p>
              {message.userid === 0 ? (
                <MyChat>{message.message}</MyChat>
              ) : (
                <OtherChat>{message.message}</OtherChat>
              )}
            </div>
          );
        })}
        {/* </div> */}
        {/* <div style={{ height: "5rem" }}></div> */}
      </div>
      <footer>
        <InputDiv>
          <p
            style={{
              fontFamily: "JejuGothic",
              fontSize: "20px",
              fontWeight: "400",
            }}
          >
            +
          </p>
          <Input
            value={message}
            onChange={messageHandler}
            onKeyUp={sendMessageHandler}
          ></Input>
        </InputDiv>
      </footer>
    </div>
  );
};

export default ChatRoom;
