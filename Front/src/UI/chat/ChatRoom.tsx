import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Navbar from "../navbar/Navbar";
import { arrowLeftIcon, outRoom } from "../../assets/AllIcon";
import { useNavigate } from "react-router-dom";
const MessageBox = styled.div<{ messageId: number }>`
  border-radius: ${props => (props.messageId === 1 ? "20px 20px 0px 20px" : "0px 20px 20px 20px")};
  background-color: ${props => (props.messageId === 1 ? "#e5bcbc" : "#F0D389")};
  /* max-width: 60%;
  min-width: 40%; */
  width: 60%;
  padding: 1rem;
  margin: 1rem auto;
  display: inline-block;
  position: relative;
  right: ${props => (props.messageId === 0 ? "16%" : "-16%")};
  word-break: break-all;
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
  align-items: center;
`;
const ChatRoom = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState<[string, number][]>([
    ["메세지", 1],
    ["메세지", 0],
  ]);
  const [isModal, setIsModal] = useState(false);
  const navigate = useNavigate();
  const rapperDiv = useRef<HTMLInputElement>(null);
  const makedummy = () => {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < 10; i++) {
        setMessages(prev => {
          return [...prev, ["메세지", 1], ["메세지", 0]];
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
        <h2>모임의 이름이 들어갑니다</h2>
        <p>대전 서구 둔산동 연남</p>
        <p>2023.01.17 PM 8:00</p>
        <div style={{ border: "1px solid var(--c-lightgray)" }}></div>
        <br />
        <h3>참여자 목록</h3>
        <p>이름</p>
        <p>이름</p>
        <p>이름</p>
        <p>이름</p>
        <div style={{ marginTop: "10rem" }}>
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
              <MessageBox messageId={message[1]} key={i}>
                <p style={{ fontFamily: "JejuGothic", fontSize: "14px" }}>{message[0]}</p>
              </MessageBox>
            </div>
          );
        })}
        <input type="text" placeholder="메세지 입력" />
        {/* </div> */}
        <div style={{ height: "5rem" }}></div>
      </div>
    </>
  );
};

export default ChatRoom;
