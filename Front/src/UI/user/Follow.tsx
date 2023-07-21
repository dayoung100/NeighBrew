import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { arrowLeftIcon, outRoom } from "../../assets/AllIcon";

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

const Follow = () => {
  const navigate = useNavigate();
  const goBackHandler = () => {
    navigate(-1);
  };
  const ArrowLeftIcon = arrowLeftIcon("var(--c-black)");
  return (
    <>
      <header>
        <ChatNav>
          <div
            style={{
              marginRight: "0rem",
              marginLeft: "0rem",
              textAlign: "center",
              cursor: "pointer",
            }}
            onClick={goBackHandler}
          >
            {ArrowLeftIcon}
          </div>
          <span style={{ marginRight: "0rem", fontFamily: "JejuGothic", fontSize: "20px" }}>
            팔로우 목록
          </span>
          <div></div>
        </ChatNav>
      </header>
    </>
  );
};
export default Follow;
