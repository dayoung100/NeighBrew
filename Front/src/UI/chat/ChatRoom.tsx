import { useParams } from "react-router-dom";
import { useState } from "react";
import styled from "styled-components";

const MessageBox = styled.div<{ float: string; messageId: number }>`
  border-radius: ${props => (props.messageId === 1 ? "20px 20px 0px 20px" : "20px 20px 20px 0px")};
  background-color: ${props => (props.messageId === 1 ? "#ffffff" : "#F0D389")};
  width: 50%;
  padding: 1rem;
  margin: 1rem auto;
  float: ${props => props.float};
`;
const ChatRoom = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState([
    ["메세지", 1],
    ["메세지", 0],
    ["메세지", 1],
    ["메세지", 0],
  ]);

  return (
    <>
      <div style={{ backgroundColor: "#949494", height: "100vh" }}>
        {messages.map((message, i) => {
          return (
            <MessageBox float={message[1] === 1 ? "right" : "left"} messageId={message[1]} key={i}>
              {message[0]}
            </MessageBox>
          );
        })}
      </div>
    </>
  );
};

export default ChatRoom;
