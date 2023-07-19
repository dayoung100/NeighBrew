/*
[MeetingMain.tsx]
모임 메인 페이지. 상단 탭에서 모임 찾기와 내 모임으로 전환 가능
*/
import { useState } from "react";
import styled from "styled-components";
import MeetingMy from "./MeetingMy";
import MeetingFind from "./MeetingFind";
import NavbarWithoutSearch from "../navbar/NavbarWithoutSearch";
import Footer from "../footer/Footer";

const TopMenu = styled.div`
  height: 2rem;
  display: flex;
  margin: 1rem 0.5rem 0 0.5rem;
  background-color: white;
  border-bottom: 1px solid var(--c-gray);
`;

const TopMenuDetail = styled.button<{ isFocused: boolean }>`
  color: var(--${props => (props.isFocused ? "c-black" : "c-gray")});
  font-family: "JejuGothic";
  font-size: 20px;
  line-height: 150%;
  padding: 0 1rem;
  outline: none;
  border: none;
  border-bottom: ${props => (props.isFocused ? "2px solid var(--c-black);" : "none;")};
  background: white;
`;

const meetingMain = () => {
  const [selectedMenu, setSelectedMenu] = useState("find");

  return (
    <div>
      <header>
        <NavbarWithoutSearch />
      </header>
      <TopMenu>
        <TopMenuDetail isFocused={selectedMenu === "find"} onClick={() => setSelectedMenu("find")}>
          모임찾기
        </TopMenuDetail>
        <TopMenuDetail isFocused={selectedMenu === "my"} onClick={() => setSelectedMenu("my")}>
          내모임
        </TopMenuDetail>
      </TopMenu>
      <div>{selectedMenu === "find" ? <MeetingFind /> : <MeetingMy />}</div>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};
export default meetingMain;
