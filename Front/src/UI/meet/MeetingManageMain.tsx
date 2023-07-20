/*
[MeetingManageMain.tsx]
모임 관리 메인 페이지
모임 정보 관리, 참여자 관리 버튼이 있음
*/
import NavbarSimple from "../navbar/NavbarSimple";
import PeopleNumInfo from "./PeopleNumInfo";

const MeetingManageMain = () => {
  return (
    <div style={{ fontFamily: "JejuGothic" }}>
      <header>
        <NavbarSimple title="모임 관리" />
      </header>
      <div style={{ fontSize: "32px", marginTop: "1rem" }}>
        모임의 제목이 들어갑니다
      </div>
      <div style={{ margin: "0 10.5rem" }}>
        <PeopleNumInfo now={1} max={4} color="var(--c-black)" size={15} />
      </div>
      <div> 관리 페이지</div>
      <div> 관리페이지 내용</div>
    </div>
  );
};
export default MeetingManageMain;
