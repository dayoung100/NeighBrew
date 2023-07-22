/*
[MeetingManageMain.tsx]
모임 관리 메인 페이지
모임 정보 관리, 참여자 관리 버튼이 있음
*/
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import NavbarSimple from "../navbar/NavbarSimple";
import PeopleNumInfo from "./PeopleNumInfo";
import Footer from "../footer/Footer";

const BigBtn = styled.div`
  border-radius: 30px;
  background: var(--c-yellow);
  width: 15rem;
  margin: 1rem auto;
  padding: 1rem;
`;

const MeetingManageMain = () => {
  const navigate = useNavigate();

  const GotoMeetInfoManage = (meetId: number) => {
    console.log("goto manage page, meetId is: ", meetId, "[member]");
    navigate(`/meet/${meetId}/manage/member`);
  };

  const GotoMemberManage = (meetId: number) => {
    console.log("goto manage page, meetId is: ", meetId, "[member]");
    navigate(`/meet/${meetId}/manage/member`);
  };

  return (
    <div style={{ fontFamily: "JejuGothic" }}>
      <header>
        <NavbarSimple title="모임 관리" />
      </header>
      <div style={{ fontSize: "32px", marginTop: "1rem" }}>모임의 제목이 들어갑니다</div>
      <div style={{ margin: "0 10.5rem" }}>
        <PeopleNumInfo now={1} max={4} color="var(--c-black)" size={15} />
      </div>
      <BigBtn onClick={() => GotoMeetInfoManage(1)}>모임 정보 관리</BigBtn>
      <BigBtn onClick={() => GotoMemberManage(1)}>참여자 관리</BigBtn>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};
export default MeetingManageMain;
