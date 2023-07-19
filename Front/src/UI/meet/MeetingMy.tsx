import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ListInfoItem from "../components/ListInfoItem";
import MeetingDetail from "./MeetingDetailSimple";
import PeopleNumInfo from "./PeopleNumInfo";

const MeetingDiv = styled.div`
  margin-bottom: 2rem;
`;

const MeetTitle = styled.div`
  font-family: "JejuGothic";
  font-size: 20px;
  text-align: left;
`;

const meetingMy = () => {
  const navigate = useNavigate();

  const moveToMeetDetail = (meetId: number) => {
    console.log(meetId, "my");
    navigate(`/meet/${meetId}`);
  };

  return (
    <div style={{ background: "var(--c-lightgray)", padding: "1rem" }}>
      <MeetingDiv>
        <MeetTitle>내가 주최 중인 모임</MeetTitle>
        <ListInfoItem
          title="내가 주최 중인 모임의 이름"
          tag="소주/맥주"
          content={<MeetingDetail />}
          numberInfo={<PeopleNumInfo now={1} max={1} />}
          isWaiting={false}
          routingFunc={() => moveToMeetDetail(1)}
        ></ListInfoItem>
      </MeetingDiv>
      <MeetingDiv>
        <MeetTitle>내가 참여 중인 모임</MeetTitle>
        <ListInfoItem
          title="내가 참여 중인 모임의 이름"
          tag="소주/맥주"
          content={<MeetingDetail />}
          numberInfo={<PeopleNumInfo now={1} max={1} />}
          isWaiting={false}
          routingFunc={() => moveToMeetDetail(1)}
        ></ListInfoItem>
      </MeetingDiv>
      <MeetingDiv>
        <MeetTitle>내가 신청한 모임</MeetTitle>
        <ListInfoItem
          title="내가 신청한 모임의 이름"
          tag="소주/맥주"
          content={<MeetingDetail />}
          numberInfo={<PeopleNumInfo now={1} max={1} />}
          isWaiting={true}
          routingFunc={() => moveToMeetDetail(1)}
        ></ListInfoItem>
        <ListInfoItem
          title="내가 신청한 모임의 이름"
          tag="소주/맥주"
          content="주류 정보는 이렇게 다른 요소는 비워두고 쓰면 될 것 같다"
          numberInfo={null}
          isWaiting={false}
          routingFunc={() => moveToMeetDetail(1)}
        ></ListInfoItem>
      </MeetingDiv>
    </div>
  );
};
export default meetingMy;
