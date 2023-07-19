import { useState, useEffect } from "react";
import styled from "styled-components";
import ListInfoItem from "../components/ListInfoItem";
import MeetingDetail from "./MeetingDetail";
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
        ></ListInfoItem>
        <ListInfoItem
          title="내가 신청한 모임의 이름"
          tag="소주/맥주"
          content={<MeetingDetail />}
          numberInfo={<PeopleNumInfo now={1} max={1} />}
          isWaiting={true}
        ></ListInfoItem>
      </MeetingDiv>
    </div>
  );
};
export default meetingMy;
