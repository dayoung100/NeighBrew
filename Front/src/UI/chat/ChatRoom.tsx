import { useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { arrowLeftIcon, outRoom } from "../../assets/AllIcon";
import { useNavigate } from "react-router-dom";
import temgif from "../../assets/temgif.gif";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
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
  const [messages, setMessages] = useState<Chat[]>([]);
  const [isModal, setIsModal] = useState(false);
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
  // 엔터 누르면 메세지 전송
  const sendMessageHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter" || e.keyCode === 13) {
      if (message === "") return;
      setMessages((prev) => [...prev, { message: message, userid: 1 }]);
      setMessage("");
      scroll();
    }
  };
  const navigate = useNavigate();
  const rapperDiv = useRef<HTMLInputElement>(null);
  // 테스트를 위한 더비 데이터 생성

  // 채팅방 입장시 채팅 메시지 가져오기
  useEffect(() => {
    callApi("GET", `api/chatMessage/${id}/messages`)
      .then((res) => {
        console.log(res.data);
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
      // setTimeout(() => {
      //   window.scrollTo({ top: rapperDiv.current!.scrollHeight, behavior: "smooth" });
      // }, 10);
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
  // var stompClient: any = null;
  // const connectHandler = () => {
  //   var socket = new SockJS("http://192.168.137.1:8080/ws"); // 서버의 WebSocket endpoint 경로를 지정
  //   console.log(socket);
  //   stompClient = Stomp.over(socket);
  //   stompClient.connect({}, function (frame: any) {
  //     console.log("Connected: " + frame);
  //     stompClient.subscribe("/sub/messages", function (chatMessage: any) {
  //       console.log(chatMessage);
  //     });
  //   });
  // };
  // const client = useRef<CompatClient>();

  // const connectHandler = () => {
  //   // client.current = Stomp.over(() => {
  //   //   const sock = new SockJS("http://192.168.137.1:8080/ws");
  //   //   console.log(sock);
  //   //   return sock;
  //   // });
  //   client.current = Stomp.client("ws://192.168.137.1:8080/ws");
  //   client.current.connect({}, () => {
  //     // callback 함수 설정, 대부분 여기에 sub 함수 씀
  //     client.current!.subscribe(`/sub/messages`, message => {
  //       setMessage(JSON.parse(message.body));
  //     });
  //   });
  // };
  // const connectHandler = () => {
  //   client.current = Stomp.over({
  //     webSocketFactory: () => new SockJS("http://192.168.137.1:8080/ws"),
  //     debug: function (str: any) {
  //       console.log(str);
  //     },
  //     reconnectDelay: 5000,
  //     heartbeatIncoming: 4000,
  //     heartbeatOutgoing: 4000,
  //     onConnect: () => {
  //       subscribe();
  //     },
  //     onStompError: (frame: any) => {
  //       console.error(frame);
  //     },
  //   });

  //   client.current.activate();
  // };
  // const subscribe = () => {
  //   client.current!.subscribe(`/sub/messages`, message => {
  //     setMessage(JSON.parse(message.body));
  //   });
  // };
  // let stompClient: any = null;
  // const connect = () => {
  //   var socket = new SockJS("http://192.168.137.1:8080/ws"); // 서버의 WebSocket endpoint 경로를 지정
  //   console.log(socket);
  //   console.log(client);
  //   stompClient = Stomp.over(socket);
  //   stompClient.connect({}, function (frame: any) {
  //     console.log("Connected: " + frame);
  //     stompClient.subscribe("/sub/messages", function (chatMessage: any) {
  //       console.log(chatMessage);
  //     });
  //   });
  // };
  // useEffect(() => {
  //   connect();
  // }, []);
  // function disconnect() {
  //   if (stompClient !== null) {
  //     stompClient.disconnect();
  //   }
  //   console.log("Disconnected");
  // }

  // function joinChatRoom() {
  //   stompClient.send(
  //     "/sub/chat/1/sendMessage",
  //     {},
  //     JSON.stringify({
  //       message: "Whoosp!!!!!!!!",
  //       userId: 1,
  //     })
  //   );
  // }

  // function joinChatRoom() {
  //     var messageInput = document.getElementById('message');
  //     var message = messageInput.value;
  //     stompClient.send("/sub/room/1/join", {}, JSON.stringify({ 'userId': 1 }));
  // }

  // const sendHandler = () => {
  //   client.current!.send(
  //     "/messages",
  //     { Authorization: `Bearer ${localStorage.getItem("token")}` },
  //     JSON.stringify({
  //       chatmessage: "a",
  //     })
  //   );
  // };
  const client = new Client({
    // brokerURL: "ws://192.168.137.1:8080/ws",
    webSocketFactory: () => new SockJS("http://192.168.137.1:8080/ws"),
    debug: function (str: string) {
      console.log(str);
    },
  });

  client.activate();

  const onClick = (message: String) => {
    console.log(client.connected);
    if (!client.connected) return;

    client.publish({
      destination: "/sub/chat/1/sendMessage",
      body: JSON.stringify({
        message: message,
      }),
    });
  };

  const wsSubscribe = () => {
    client.onConnect = () => {
      client.subscribe(
        "/sub/messages",
        (msg: any) => {
          const newMessage = JSON.parse(msg.body).message;
        },
        { id: "user" }
      );
    };
  };

  const wsDisconnect = () => {
    client.deactivate();
  };
  return (
    <div ref={rapperDiv}>
      <button onClick={wsSubscribe}>연결</button>
      {/* <button onClick={joinChatRoom}>메세지 보내기</button> */}
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
            이런저런 ㅇㅇㅇㅇ방 이름
            <>
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
              {/* <MessageBox messageId={message[1]} key={i}>
                <p style={{ fontFamily: "JejuGothic", fontSize: "14px" }}>{message[0]}</p>
              </MessageBox> */}
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
