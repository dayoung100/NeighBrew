// 채팅방 목록을 보여줌
// 채팅방 목록을 클릭하면 채팅방으로 이동
// 채팅방 목록은 채팅방 이름, 채팅방 마지막 메시지, 채팅방 마지막 메시지 시간을 보여줌

import { useState, useEffect } from "react";
import styled from "styled-components";
import Chat from "./Chat";
import { meetingicon, directMessage } from "../../assets/AllIcon";
import Footer from "../footer/Footer";

const Button = styled.button`
  width: 40%;
  display: inline-block;
  height: 3rem;
  background-color: white;
  border: none;
  margin: 1rem auto;
`;

const ChatList = () => {
  const [chatList, setChatList] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [directChatList, setdirectChatList] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [chooseChat, setChooseChat] = useState(0); // 선택한 채팅방의 index
  const MeetingIcon = meetingicon(chooseChat === 0 ? "var(--c-black)" : "#AAAAAA");
  const directMessageIcon = directMessage(chooseChat === 0 ? "#AAAAAA" : "var(--c-black)");
  const btn = () => {
    // Notification.requestPermission().then((status) => {
    //   console.log("Notification 상태", status);
    //   if (status === "denied") {
    //     alert("Notification 거부됨");
    //   } else if (navigator.serviceWorker) {
    //     navigator.serviceWorker
    //       .register("/serviceworker.js") // serviceworker 등록
    //       .then(function (registration) {
    //         const subscribeOptions = {
    //           userVisibleOnly: true,
    //           // push subscription이 유저에게 항상 보이는지 여부. 알림을 숨기는 등 작업이 들어가지는에 대한 여부인데, 크롬에서는 true 밖에 지원안한다.
    //           // https://developers.google.com/web/fundamentals/push-notifications/subscribing-a-user
    //           applicationServerKey: "BIqrfyWBegSK9OBBB_HPzvOo_8oBtQcQkgsmBh9c9r_-4pL_Jmbj8SJmutwqzfapsYFnsMjdjBhj8Av90JHtrHI", // 발급받은 vapid public key
    //         };
    //         return registration.pushManager.subscribe(subscribeOptions);
    //       })
    //       .then(function (pushSubscription) {
    //         // subscription 정보를 저장할 서버로 보낸다.
    //         postSubscription(pushSubscription);
    //       });
    //   }
    // });
  };
  return (
    <>
      <button onClick={btn}>button</button>
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
          style={{ borderBottom: chooseChat === 0 ? "none" : "2px solid var(--c-black)" }}
        >
          {directMessageIcon}
        </Button>
      </div>
      <div style={{ padding: "1rem", backgroundColor: "var(--c-lightgray)" }}>
        {chooseChat === 0
          ? chatList.map((chat, i) => {
              return <Chat key={i} chooseChat={chooseChat} chatRoomId={chat}></Chat>;
            })
          : directChatList.map((chat, i) => {
              return <Chat key={i} chooseChat={chooseChat} chatRoomId={chat}></Chat>;
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
