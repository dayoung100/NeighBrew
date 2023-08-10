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
import { initialMeet, WhiteModal } from "../common";
import { Meeting } from "../../Type/types";

const BigBtn = styled.div`
  border-radius: 30px;
  background: var(--c-yellow);
  width: 15rem;
  margin: 1rem auto;
  padding: 1rem;
`;

const MeetingManageMain = () => {
  const navigate = useNavigate();
  const { meetId } = useParams(); //meetId는 라우터 링크에서 따오기
  const [deleteModalOn, setDeleteModalOn] = useState(false);
  const [errorModalOn, setErrorModalOn] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [meetData, setMeetData] = useState<Meeting>(initialMeet);

  const GotoMeetInfoManage = (meetId: number) => {
    navigate(`/meet/${meetId}/manage/info`);
  };

  const GotoMemberManage = (meetId: number) => {
    navigate(`/meet/${meetId}/manage/member`);
  };

  const GoMeetMainHandler = () => {
    navigate(`/meet`);
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  //api 호출, 모임 이름 세팅
  useEffect(() => {
    callApi("get", `api/meet/${meetId}`).then((res) =>
      setMeetData(res.data.meetDto)
    );
  }, [meetId]);

  //모임 삭제 요청
  const DeleteMeeting = async () => {
    const promise = callApi("delete", `api/meet/delete/${meetId}`, {
      userId: parseInt(localStorage.getItem("myId")),
    });
    promise
      .then((res) => {
        GoMeetMainHandler();
      })
      .catch((e) => {
        setErrMsg(e.response.data);
        setErrorModalOn(true);
      });
  };

  return (
    <div style={{ fontFamily: "JejuGothic" }}>
      <header>
        <NavbarSimple title="모임 관리" />
      </header>
      <div
        style={{
          fontSize: "32px",
          margin: "1rem auto 0.5rem auto",
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
              DeleteMeeting();
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
      </Modal>
      <Modal
        isOpen={errorModalOn}
        onRequestClose={() => setErrorModalOn(false)}
        style={WhiteModal}
      >
        {errMsg}
      </Modal>
      <Footer />
    </div>
  );
};
export default MeetingManageMain;
