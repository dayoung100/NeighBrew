// 채팅방 목록에서 보일 개별 채팅방 컴포넌트
import styled from "styled-components";
import tempimg from "../../assets/tempgif.gif";
import temimg from "../../assets/temgif.gif";
import { useNavigate } from "react-router-dom";

const ChatDiv = styled.div`
  padding: 0.3rem;
  min-height: 5rem;
  /* height: 12rem; */
  width: 95%;
  margin: 0.5rem auto;
  border-radius: 15px;
  background-color: #ffffff;
  /* border: 1px solid var(--c-gray); */
  display: flex;
  text-align: center;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
`;
const ImgDiv = styled.div`
  width: 20%;
  height: 100%;
  overflow: hidden;
  /* inline-size: 25ch; */
  aspect-ratio: 1/1;
  border-radius: 50%;
  float: left;
  margin-right: 1rem;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Chat = (props: { chooseChat: number; chatRoomId: number }) => {
  const navigate = useNavigate();

  const moveToChatRoomHandler = () => {
    navigate(`/chatList/${props.chatRoomId}`);
  };
  return (
    <ChatDiv onClick={moveToChatRoomHandler}>
      <ImgDiv>
        <Img src={props.chooseChat == 0 ? tempimg : temimg}></Img>
      </ImgDiv>
      <div style={{}}>
        <div style={{ textAlign: "left" }}>
          <span style={{ marginRight: "3px", fontSize: "14px", fontFamily: "JejuGothic" }}>
            채팅방 제목: 집에 가고 싶다
          </span>
          <span style={{ color: "var(--c-gray", fontSize: "12px" }}>4</span> <span></span>
        </div>
        <p style={{ fontSize: "12px", fontFamily: "SeoulNamsan" }}>
          채팅방 설명 몇 자까지 가능 한가요 너무 많으면 이상해 집니다
        </p>
      </div>
    </ChatDiv>
  );
};
export default Chat;
