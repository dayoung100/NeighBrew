/*
[MeetingMy.tsx]
내 모임 페이지
내가 주최 중인 모임, 내가 참여 중인 모임, 내가 신청한 모임 출력
*/
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import MeetingListItem from "./../meet/MeetingListItem";
import { callApi } from "../../utils/api";

const MeetingDiv = styled.div`
  margin-bottom: 2rem;
  min-height: 250px;
`;

const MeetTitle = styled.div`
  font-family: "JejuGothic";
  font-size: 20px;
  text-align: left;
`;

const meetingMy = (props: { userId: number }) => {
  //현재 유저의 userId
  const [userId, setUserId] = useState(0);

  //불러온 모임 데이터
  const [meetData, setMeetData] = useState({
    HOST: [],
    APPLY: [],
    GUEST: [],
  }); //userId의 모임 전체
  const [hostMeet, setHostMeet] = useState([]); //userId가 만든 모임
  const [applyMeet, setApplyMeet] = useState([]); //userId가 지원한 모임
  const [guestMeet, setGuestMeet] = useState([]); //userId가 참여한 모임

  useEffect(() => {
    setUserId(props.userId);
  });

  //api 호출
  useEffect(() => {
    if (userId !== 0) {
      const promise = callApi("get", `api/meet/mymeet/${userId}`);
      promise.then(res => {
        console.dir(res.data);
        setMeetData(res.data); //받아온 데이터로 meetData 세팅
      });
    }
  }, [userId]);

  //create, apply, attend 모임 갱신
  useEffect(() => {
    setHostMeet(meetData.HOST);
    setApplyMeet(meetData.APPLY);
    setGuestMeet(meetData.GUEST);
  }, [meetData]);

  return (
    <div style={{ background: "var(--c-lightgray)", padding: "1rem" }}>
      <MeetingDiv>
        <MeetTitle>내가 주최 중인 모임</MeetTitle>
        <MeetingListItem data={hostMeet} />
      </MeetingDiv>
      <MeetingDiv>
        <MeetTitle>내가 참여 중인 모임</MeetTitle>
        <MeetingListItem data={guestMeet} />
      </MeetingDiv>
    </div>
  );
};
export default meetingMy;
