import { callApi } from "./utils/api";
import SockJS from "sockjs-client";
import { CompatClient, Stomp, Client } from "@stomp/stompjs";
import { useState, useRef } from "react";
const Test = () => {
  const event = new EventSource("http://i9b310.p.ssafy.io/api/push/connect/11", {
    withCredentials: true,
  });
  event.addEventListener("open", e => {
    console.log("연결완료");
  });
  event.addEventListener("sse", e => {
    console.log(e.data);
  });
  const followHandler = async () => {
    const api = await callApi("post", `api/follow/guard/11`)
      .then(res => {
        // console.log(res.data);
      })
      .catch(err => console.log(err));
  };
  //   const client = useRef<CompatClient>();

  //   const connect = () => {
  //     client.current = Stomp.over(() => {
  //       const sock = new SockJS("http://i9b310.p.ssafy.io/ws");
  //       return sock;
  //     });
  //     client.current.connect({}, frame => {
  //       client.current?.subscribe("/sub/chat/8", message => {
  //         console.log(message);
  //       });
  //     });
  //   };
  //   const sendHandler = () => {
  //     client.current.send(
  //       "/sub/chat/8/sendMessage",
  //       {},
  //       JSON.stringify({
  //         message: message,
  //         userId: localStorage.getItem("myId"),
  //       })
  //     );
  //     setMessages("");
  //   };
  //   window.onload = function () {
  //     connect();
  //   };

  //   window.onbeforeunload = function () {
  //     disconnect();
  //   };
  const [message, setMessages] = useState("");
  const inputHandler = e => {
    e.preventDefault();
    setMessages(e.target.value);
  };
  return (
    <div>
      <h1>Test</h1>
      <input type="text" onChange={inputHandler} />
      {/* <button onClick={sendHandler}>제출</button> */}
      <button onClick={followHandler}>TESt</button>
    </div>
  );
};
export default Test;
