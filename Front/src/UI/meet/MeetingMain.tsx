import { useState } from "react";
import styled from "styled-components";
import MeetingMy from "./MeetingMy";
import MeetingFind from "./MeetingFind";

const TopMenu = styled.div`
  height: 2rem;
  display: flex;
  margin: 1rem 0.5rem 0 0.5rem;
  background-color: white;
  border-bottom: 1px solid #e8e8e8;
`;

const TopMenuDetail = styled.button<{ isFocused: boolean }>`
  color: ${props => (props.isFocused ? "#322d29;" : "#AAAAAA;")};
  font-family: "JejuGothic";
  font-size: 20px;
  line-height: 150%;
  padding: 0 1rem;
  outline: none;
  border: none;
  border-bottom: ${props => (props.isFocused ? "2px solid #322d29;" : "none;")};
  background: white;
`;

const meetingMain = () => {
  const [selectedMenu, setSelectedMenu] = useState("find");

  return (
    <div>
      <TopMenu>
        <TopMenuDetail isFocused={selectedMenu === "find"} onClick={() => setSelectedMenu("find")}>
          모임찾기
        </TopMenuDetail>
        <TopMenuDetail isFocused={selectedMenu === "my"} onClick={() => setSelectedMenu("my")}>
          내모임
        </TopMenuDetail>
      </TopMenu>
      <div>{selectedMenu === "find" ? <MeetingFind /> : <MeetingMy />}</div>
    </div>
  );
};
export default meetingMain;
