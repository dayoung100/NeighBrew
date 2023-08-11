/*
[MeetingMy.tsx]
내 모임 페이지
내가 주최 중인 모임, 내가 참여 중인 모임, 내가 신청한 모임 출력
*/
import { useState, useEffect } from "react";
import styled from "styled-components";
import MeetingListItem from "./MeetingListItem";
import EmptyMsg from "./../components/EmptyMsg";
import { callApi } from "../../utils/api";

const MeetingDiv = styled.div`
  margin-bottom: 2rem;
`;

const MeetTitle = styled.div`
  font-family: "JejuGothic";
  font-size: 20px;
  text-align: left;
`;

const meetingMy = () => {
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
    //로컬 스토리지에서 userId 가져오기
    setUserId(parseInt(localStorage.getItem("myId")));
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  //api 호출
  useEffect(() => {
    const promise = callApi("get", `api/meet/mymeet/${userId}`);
    promise.then((res) => {
      setMeetData(res.data); //받아온 데이터로 meetData 세팅
    });
  }, [userId]);

  //create, apply, attend 모임 갱신
  useEffect(() => {
    setHostMeet(meetData.HOST);
    setApplyMeet(meetData.APPLY);
    setGuestMeet(meetData.GUEST);
  }, [meetData]);

  return (
    // <div style={{ background: "var(--c-lightgray)", padding: "1rem" }}>
      <div style={{ background: "white", padding: "1rem" }}>
      <MeetingDiv>
        <MeetTitle>개설</MeetTitle>
        {hostMeet.length > 0 && <MeetingListItem data={hostMeet} />}
        {hostMeet.length === 0 && (
          <EmptyMsg
            title="개설한 모임이 없습니다"
            contents={`모임을 만들어보세요!\n개설한 모임은 여기에 표시됩니다`}
          />
        )}
      </MeetingDiv>
      <MeetingDiv>
        <MeetTitle>참여</MeetTitle>
        {guestMeet.length > 0 && <MeetingListItem data={guestMeet} />}
        {guestMeet.length === 0 && (
          <EmptyMsg
            title="참여 중인 모임이 없습니다"
            contents={`마음에 드는 모임을 찾아 신청해보세요!\n참여 확정된 모임은 여기에 표시됩니다`}
          />
        )}
      </MeetingDiv>
      <MeetingDiv>
        <MeetTitle>대기</MeetTitle>
        {applyMeet.length > 0 && <MeetingListItem data={applyMeet} />}
        {applyMeet.length === 0 && (
          <EmptyMsg
            title="대기 중인 모임이 없습니다"
            contents={`마음에 드는 모임을 찾아 신청해보세요!\n참여 신청한 모임은 여기에 표시됩니다.`}
          />
        )}
      </MeetingDiv>
    </div>
  );
};
export default meetingMy;
