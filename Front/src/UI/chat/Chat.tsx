// 채팅방 목록에서 보일 개별 채팅방 컴포넌트
import styled from "styled-components";
import tempimg from "../../assets/tempgif.gif";
import temimg from "../../assets/temgif.gif";

const ChatDiv = styled.div`
  padding: 0.3rem;
  height: 5rem;
  width: 80%;
  margin: 0.5rem auto;
  border-radius: 0.5rem;
  background-color: #ffffff;
  border: 1px solid #000000;
  display: flex;
`;
const ImgDiv = styled.div`
  width: 30%;
  height: 80%;
  border-radius: 70%;
  overflow: hidden;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Chat = (props: { chooseChat: number }) => {
  return (
    <ChatDiv>
      <ImgDiv>
        <Img src={props.chooseChat == 0 ? tempimg : temimg}></Img>
      </ImgDiv>
      <div style={{}}>
        <span>채팅방 제목</span> <span>인원 수</span>
        <p>채팅방 설명</p>
      </div>
    </ChatDiv>
  );
};
export default Chat;
