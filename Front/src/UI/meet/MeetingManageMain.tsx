/*
[MeetingManageMain.tsx]
모임 관리 메인 페이지
모임 정보 관리, 참여자 관리 버튼이 있음
*/
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Modal from "react-modal";
import NavbarSimple from "../navbar/NavbarSimple";
import PeopleNumInfo from "./PeopleNumInfo";
import Footer from "../footer/Footer";
import { callApi } from "../../utils/api";
import { Meeting } from "../../Type/types";

const BigBtn = styled.div`
  border-radius: 1.875rem;
  background: var(--c-yellow);
  width: 15rem;
  margin: 1rem auto;
  padding: 1rem;
`;

const WhiteModal = {
  content: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "15rem",
    height: "6rem",
    padding: ".5rem 1rem",
    borderRadius: ".9375rem",
    background: "white",
    textAlign: "center",
    fontFamily: "SeoulNamsan",
  },
  overlay: {
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: "11",
  },
};

const initialData: Meeting = {
  meetId: 0,
  meetName: "",
  description: "",
  hostId: 0,
  nowParticipants: 0,
  maxParticipants: 8,
  meetDate: "0000-01-01T00:00:00",
  tagId: 0,
  sido: "-",
  gugun: "-",
  dong: "-",
  imgSrc: "",
};

const MeetingManageMain = () => {
  const navigate = useNavigate();
  const { meetId } = useParams(); //meetId는 라우터 링크에서 따오기
  const [deleteModalOn, setDeleteModalOn] = useState(false);
  const [meetData, setMeetData] = useState<Meeting>(initialData);

  const GotoMeetInfoManage = (meetId: number) => {
    console.log("goto manage page, meetId is: ", meetId, "[info]");
    navigate(`/meet/${meetId}/manage/info`);
  };

  const GotoMemberManage = (meetId: number) => {
    console.log("goto manage page, meetId is: ", meetId, "[member]");
    navigate(`/meet/${meetId}/manage/member`);
  };

  //api 호출, 모임 이름 세팅
  useEffect(() => {
    callApi("get", `api/meet/${meetId}`).then((res) =>
      setMeetData(res.data.meetDto)
    );
  }, [meetId]);

  return (
    <div style={{ fontFamily: "JejuGothic" }}>
      <header>
        <NavbarSimple title="모임 관리" />
      </header>
      <div
        style={{
          fontSize: "2rem",
          margin: "1rem auto .5rem auto",
          width: "20rem",
        }}
      >
        {meetData.meetName}
      </div>
      <div style={{ margin: "0 10.5rem" }}>
        <PeopleNumInfo
          now={meetData.nowParticipants}
          max={meetData.maxParticipants}
          color="var(--c-black)"
          size={15}
        />
      </div>
      <BigBtn onClick={() => GotoMeetInfoManage(parseInt(meetId))}>
        모임 정보 관리
      </BigBtn>
      <BigBtn onClick={() => GotoMemberManage(parseInt(meetId))}>
        참여자 관리
      </BigBtn>
      <BigBtn
        style={{ background: "#F28F79" }}
        onClick={() => setDeleteModalOn(true)}
      >
        모임 삭제
      </BigBtn>
      <Modal
        isOpen={deleteModalOn}
        onRequestClose={() => setDeleteModalOn(false)}
        style={WhiteModal}
      >
        <div style={{ padding: "1rem 0" }}>
          이 모임을 정말 삭제하시겠습니까?
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <div
            onClick={() => {
              console.log("삭제 완료");
              setDeleteModalOn(false);
            }}
            style={{ width: "7rem", padding: ".5rem 0" }}
          >
            예
          </div>
          <div>|</div>
          <div
            onClick={() => {
              console.log("삭제 취소");
              setDeleteModalOn(false);
            }}
            style={{ width: "7rem", padding: ".5rem 0" }}
          >
            아니오
          </div>
        </div>
      </Modal>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};
export default MeetingManageMain;
