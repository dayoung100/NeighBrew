/*
[MeetingMemeberManage.tsx]
모임 관리 - 참여자 관리 페이지
참여중인 인원, 신청한 인원을 보여주고 승인, 거절이 가능
*/
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Modal from "react-modal";
import styled from "styled-components";
import NavbarSimple from "../navbar/NavbarSimple";
import PeopleNumInfo from "./PeopleNumInfo";
import Footer from "../footer/Footer";
import UserInfoItem from "../components/UserInfoItem";
import { callApi } from "../../utils/api";
import { MeetDetail, User } from "../../Type/types";

const SubTitle = styled.div`
  font-size: 20px;
  margin: 2rem 1rem 0.5rem 1rem;
`;

const BtnSmall = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  width: 2rem;
  min-width: 2rem;
  height: 2rem;
  border-radius: 5px;
  margin: 0 0.2rem;
`;

const OKBtn = styled(BtnSmall)`
  background: var(--c-yellow);
`;

const NoBtn = styled(BtnSmall)`
  background: #f28f79;
`;

const WhiteModal = {
  content: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "15rem",
    height: "6rem",
    padding: "0.5rem 1rem",
    borderRadius: "15px",
    background: "white",
    textAlign: "center",
    fontFamily: "NanumSquareNeo",
  },
  overlay: {
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: "11",
  },
};

const initialData: MeetDetail = {
  meetDto: {
    meetId: 0,
    meetName: "",
    description: "",
    nowParticipants: 0,
    maxParticipants: 0,
    meetDate: "0000-01-01T00:00:00",
    tagId: 0,
    sido: "-",
    gugun: "-",
    dong: "-",
    drink: {
      degree: 0,
      description: "",
      drinkId: 0,
      image: "",
      name: "",
      tagId: 0,
    },
    imgSrc: "",
  },
  users: [],
  statuses: [],
};

const initialUser = {
  userId: 0,
  email: "",
  nickname: "",
  name: "",
  liverPoint: 0,
  profile: "",
  follower: 0,
  following: 0,
};

const MeetingMemberManage = () => {
  const { meetId } = useParams(); //meetId는 라우터 링크에서 따오기
  const [meetData, setMeetData] = useState<MeetDetail>(initialData);
  const [memberList, setMemberList] = useState<User[]>([]);
  const [applicantList, setApplicantList] = useState<User[]>([]);
  const [modalOn, setModalOn] = useState(false);
  const [targetUser, setTargetUser] = useState<User>(initialUser); //승인/거절할 유저
  const [targetAction, setTargetAction] = useState(true); //승인:true, 거절:false
  const [errorModalOn, setErrorModalOn] = useState(false);
  const [errorModalMsg, setErrorModalMsg] = useState("");

  const fetchMeetData = () => {
    const promise = callApi("get", `api/meet/${meetId}`);
    promise.then((res) => {
      setMeetData(res.data);
    });
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    fetchMeetData();
  }, []);

  useEffect(() => {
    if (meetData === undefined) return;
    //guest 세팅
    let member = meetData.users.filter(
      (user, index) => meetData.statuses[index] !== "APPLY"
    );
    setMemberList(member);
    //apply 세팅
    let applicants = meetData.users.filter(
      (user, index) => meetData.statuses[index] === "APPLY"
    );
    setApplicantList(applicants);
  }, [meetData]);

  //수락/거절하기
  const memberHandler = (user: User) => {
    const promise = callApi("post", `api/meet/manage-user`, {
      userId: user.userId,
      meetId: parseInt(meetId),
      applyResult: targetAction,
    });
    promise
      .then(() => {
        fetchMeetData();
      })
      .catch((e) => {
        setErrorModalMsg(e.response.data);
        setErrorModalOn(true);
      });
  };

  return (
    <div style={{ fontFamily: "JejuGothic" }}>
      <header>
        <NavbarSimple title="모임 관리" />
      </header>
      <div style={{ fontSize: "32px", marginTop: "1rem" }}>
        {meetData.meetDto.meetName}
      </div>
      <div style={{ marginBottom: "7rem" }}>
        <SubTitle style={{ display: "flex", alignItems: "center" }}>
          <div>참여중</div>
          <PeopleNumInfo
            now={meetData.meetDto.nowParticipants}
            max={meetData.meetDto.maxParticipants}
            color="var(--c-black)"
            size={15}
          />
        </SubTitle>
        <div style={{ margin: "0 1rem" }}>
          {memberList.map((member, index) => {
            return (
              <UserInfoItem
                key={member.userId}
                user={member}
                isMaster={index === 0}
                width={15}
              />
            );
          })}
        </div>
        <SubTitle style={{ textAlign: "left" }}>참여 신청</SubTitle>
        <div style={{ margin: "0 1rem" }}>
          {applicantList.map((applicant) => {
            return (
              <div
                key={applicant.userId}
                style={{ display: "flex", alignItems: "center" }}
              >
                <UserInfoItem user={applicant} isMaster={false} width={13} />
                <OKBtn
                  onClick={() => {
                    setTargetAction(true);
                    setTargetUser(applicant);
                    setModalOn(true);
                  }}
                >
                  <img src="/src/assets/checkButtonIcon.svg" />
                </OKBtn>
                <NoBtn
                  onClick={() => {
                    setTargetAction(false);
                    setTargetUser(applicant);
                    setModalOn(true);
                  }}
                >
                  <img src="/src/assets/XButtonIcon.svg" />
                </NoBtn>
              </div>
            );
          })}
        </div>
      </div>
      <Modal
        isOpen={modalOn}
        onRequestClose={() => setModalOn(false)}
        style={WhiteModal}
      >
        <div style={{ padding: "1rem 0" }}>
          유저 {targetUser.nickname}을/를 <br />
          {targetAction ? "승인" : "거절"}
          하시겠습니까?
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
              memberHandler(targetUser);
              setModalOn(false);
            }}
            style={{ width: "7rem", padding: "0.5rem 0" }}
          >
            예
          </div>
          <div>|</div>
          <div
            onClick={() => {
              setModalOn(false);
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
        {errorModalMsg}
      </Modal>
      <Footer />
    </div>
  );
};
export default MeetingMemberManage;
