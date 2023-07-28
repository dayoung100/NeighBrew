/*
[MeetingMy.tsx]
내 모임 페이지
내가 주최 중인 모임, 내가 참여 중인 모임, 내가 신청한 모임 출력
*/
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ListInfoItem from "../components/ListInfoItem";
import MeetingDetail from "./MeetingDetailSimple";
import PeopleNumInfo from "./PeopleNumInfo";
import { callApi } from "../../utils/api";
import { Meetings } from "../../Type/types";

const MeetingDiv = styled.div`
  margin-bottom: 2rem;
`;

const MeetTitle = styled.div`
  font-family: "JejuGothic";
  font-size: 20px;
  text-align: left;
`;

const meetingMy = () => {
  //네비게이터 : 모임 상세페이지로 이동
  const navigate = useNavigate();
  const GotoMeetDetailHandler = (meetId: number) => {
    console.log("goto detail page, meetId is: ", meetId, "[my]");
    navigate(`/meet/${meetId}`);
  };
  //현재 유저의 userId
  const [userId, setUserId] = useState();
  //로컬 스토리지에서 userId 가져오기

  //불러온 모임 데이터
  const [meetData, setMeetData] = useState({
    CREATE: [],
    APPLY: [],
    ATTEND: [],
  }); //userId의 모임 전체
  const [createMeet, setCreateMeet] = useState([]); //userId가 만든 모임
  const [applyMeet, setApplyMeet] = useState([]); //userId가 지원한 모임
  const [attendMeet, setAttendMeet] = useState([]); //userId가 참여한 모임

  //api 호출
  useEffect(() => {
    const promise = callApi("get", `api/meet/mymeet/${userId}`);
    promise.then((res) => {
      setMeetData(res.data); //받아온 데이터로 meetData 세팅
    });
  }, []);
  //create, apply, attend 모임 갱신
  useEffect(() => {
    setCreateMeet(meetData.CREATE);
    setApplyMeet(meetData.APPLY);
    setAttendMeet(meetData.ATTEND);
  }, [meetData]);

  return (
    <div style={{ background: "var(--c-lightgray)", padding: "1rem" }}>
      <MeetingDiv>
        <MeetTitle>내가 주최 중인 모임</MeetTitle>
        <ListInfoItem
          title="내가 주최 중인 모임의 이름"
          imgSrc="../src/assets/ForTest/backgroundImg.jpg"
          tag="소주/맥주"
          content={
            <MeetingDetail
              position=""
              time=""
              hostId={1}
              liverLimit={true}
              ageLimit={true}
            />
          }
          numberInfo={
            <PeopleNumInfo now={1} max={1} color="var(--c-black)" size={11} />
          }
          isWaiting={false}
          outLine={false}
          routingFunc={() => GotoMeetDetailHandler(1)}
        ></ListInfoItem>
      </MeetingDiv>
      <MeetingDiv>
        <MeetTitle>내가 참여 중인 모임</MeetTitle>
        <ListInfoItem
          title="내가 참여 중인 모임의 이름"
          imgSrc="../src/assets/ForTest/backgroundImg.jpg"
          tag="소주/맥주"
          content={
            <MeetingDetail
              position=""
              time=""
              hostId={1}
              liverLimit={true}
              ageLimit={true}
            />
          }
          numberInfo={
            <PeopleNumInfo now={1} max={1} color="var(--c-black)" size={11} />
          }
          isWaiting={false}
          outLine={false}
          routingFunc={() => GotoMeetDetailHandler(1)}
        ></ListInfoItem>
      </MeetingDiv>
      <MeetingDiv>
        <MeetTitle>내가 신청한 모임</MeetTitle>
        <ListInfoItem
          title="내가 신청한 모임의 이름"
          imgSrc="../src/assets/ForTest/backgroundImg.jpg"
          tag="소주/맥주"
          content={
            <MeetingDetail
              position=""
              time=""
              hostId={1}
              liverLimit={true}
              ageLimit={true}
            />
          }
          numberInfo={
            <PeopleNumInfo now={1} max={1} color="var(--c-black)" size={11} />
          }
          isWaiting={true}
          outLine={false}
          routingFunc={() => GotoMeetDetailHandler(1)}
        ></ListInfoItem>
        <ListInfoItem
          title="내가 신청한 모임의 이름"
          imgSrc="../src/assets/ForTest/backgroundImg.jpg"
          tag="소주/맥주"
          content="주류 정보는 이렇게 다른 요소는 비워두고 쓰면 될 것 같다"
          numberInfo={null}
          isWaiting={false}
          outLine={false}
          routingFunc={() => GotoMeetDetailHandler(1)}
        ></ListInfoItem>
      </MeetingDiv>
    </div>
  );
};
export default meetingMy;
