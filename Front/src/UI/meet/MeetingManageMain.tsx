/*
[MeetingManageMain.tsx]
모임 관리 메인 페이지
모임 정보 관리, 참여자 관리 버튼이 있음
*/
import { useState } from "react";
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

const BlackBg = styled.div`
position: fixed;
  top:0; left: 0; bottom: 0; right: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 11;
}
`;

const WhiteModal = styled.div`
  position: absolute;
  bottom: 10rem;
  left: 50%;
  transform: translate(-50%, 0);
  width: 15rem;
  padding: 1rem;
  border-radius: 15px;
  background: white;
`;

const MeetingManageMain = () => {
  const navigate = useNavigate();
  const [isOwner, setIsOwner] = useState(true); //모임 주최자인가?
  const [deleteModalOn, setDeleteModalOn] = useState(false);

  const GotoMeetInfoManage = (meetId: number) => {
    console.log("goto manage page, meetId is: ", meetId, "[info]");
    navigate(`/meet/${meetId}/manage/info`);
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
      <BigBtn style={{ background: "#F28F79" }} onClick={() => setDeleteModalOn(true)}>
        모임 삭제
      </BigBtn>
      {deleteModalOn && (
        <BlackBg
          onClick={() => {
            console.log("검은 배경 클릭, 모달 닫기");
            setDeleteModalOn(false);
          }}
        >
          <WhiteModal>
            <div style={{ padding: "1rem 0" }}>이 모임을 정말 삭제하시겠습니까?</div>
            <div style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center" }}>
              <div
                onClick={() => {
                  console.log("삭제 완료");
                  setDeleteModalOn(false);
                }}
                style={{ width: "7rem", padding: "0.5rem 0" }}
              >
                예
              </div>
              <div>|</div>
              <div
                onClick={() => {
                  console.log("삭제 취소");
                  setDeleteModalOn(false);
                }}
                style={{ width: "7rem", padding: "0.5rem 0" }}
              >
                아니오
              </div>
            </div>
          </WhiteModal>
        </BlackBg>
      )}
      <footer>
        <Footer />
      </footer>
    </div>
  );
};
export default MeetingManageMain;
