/*
[MeetingMain.tsx]
모임 메인 페이지. 상단 탭에서 모임 찾기와 내 모임으로 전환 가능
*/
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import MeetingMy from "./MeetingMy";
import MeetingFind from "./MeetingFind";
import NavbarWithoutSearch from "../navbar/NavbarWithoutSearch";
import Footer from "../footer/Footer";
import { callApi } from "../../utils/api";

const TopMenu = styled.div`
  height: 2rem;
  display: flex;
  margin: 1rem 0.5rem 0 0.5rem;
  background-color: white;
  border-bottom: 1px solid var(--c-gray);
`;

const TopMenuDetail = styled.button<{ isfocused: string }>`
  color: var(--${props => (props.isfocused === "true" ? "c-black" : "c-gray")});
  font-family: "JejuGothic";
  font-size: 20px;
  line-height: 150%;
  padding: 0 1rem;
  outline: none;
  border: none;
  border-bottom: ${props => (props.isfocused === "true" ? "2px solid var(--c-black);" : "none;")};
  background: white;
`;

const RoundBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 10%;

  background: var(--c-yellow);
  width: 4rem;
  height: 4rem;
  border-radius: 100px;
  z-index: 10;

  @media (max-width: 430px) {
    right: 5%;
  }
  @media (min-width: 431px) {
    left: 350px;
  }
`;

const meetingMain = () => {
  const [selectedMenu, setSelectedMenu] = useState("find");
  const navigate = useNavigate();

  const GotoCreateHandler = () => {
    navigate(`/meet/create`);
  };

  useEffect(() => {
    callApi("POST", "api/user/refresh-token");
    localStorage.setItem("chooseMenu", "0");
  }, []);

  return (
    <div>
      <header>
        <NavbarWithoutSearch />
      </header>
      <TopMenu>
        <TopMenuDetail
          isfocused={selectedMenu === "find" ? "true" : "false"}
          onClick={() => setSelectedMenu("find")}
        >
          모임찾기
        </TopMenuDetail>
        <TopMenuDetail
          isfocused={selectedMenu === "my" ? "true" : "false"}
          onClick={() => setSelectedMenu("my")}
        >
          내모임
        </TopMenuDetail>
      </TopMenu>
      <div
        style={{
          paddingBottom: "10rem",
          background: "var(--c-lightgray)",
          minHeight: "80vh",
        }}
      >
        {selectedMenu === "find" ? <MeetingFind /> : <MeetingMy />}
      </div>
      <footer>
        <RoundBtn onClick={GotoCreateHandler}>
          <img src="/src/assets/plusButton.svg" width="25rem" />
        </RoundBtn>
        <Footer />
      </footer>
    </div>
  );
};
export default meetingMain;
