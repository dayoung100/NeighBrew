import { useState } from "react";
import styled from "styled-components";
import { Meeting, User } from "../../Type/types";

const InnerText = styled.div`
  width: 5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

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

/**
 * 모임 리스트에 모임에 대한 간략 정보를 출력하는 부분.
 * ListInfoItem에 props로 전달되어 content 내부에 들어감
 */
const meetingDetail = ({ meetData }: { meetData: Meeting }) => {
  //날짜와 시간 변환 함수
  function formateDate(dateData: string) {
    const date = new Date(dateData);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();

    return `${month}월 ${day}일 ${hour}시 ${minute}분`;
  }

  const position = `${meetData.sido} ${meetData.gugun} ${meetData.dong}`;
  const formattedDate = formateDate(meetData.meetDate);
  const hasAgeLimit =
    (meetData.minAge ?? 0) > 0 || (meetData.maxAge ?? 0) > 0 ? true : false;
  const hasLiverLimit = (meetData.minLiverPoint ?? 0) > 0 ? true : false;
  //TODO: 호스트 아이디로 호스트 프사와 닉네임 가져오기
  const [host, setHost] = useState<User>(initialUser);

  return (
    <div style={{ fontFamily: "Noto Sans KR", fontSize: "10px" }}>
      <div style={{ display: "flex" }}>
        <div style={{ display: "flex", alignContent: "center", width: "50%" }}>
          <img src="/src/assets/mapPin.svg" width="10rem"></img>
          <InnerText>{position}</InnerText>
        </div>
        <div style={{ display: "flex", alignContent: "center" }}>
          <img src="/src/assets/calendar.svg" width="10rem" />
          {formattedDate}
        </div>
      </div>
      <div>
        <span>{host.profile}</span>
        <span>주최자: {host.nickname}</span>
      </div>
      <div style={{ display: "flex" }}>
        {hasLiverLimit && (
          <div style={{ display: "flex", alignItems: "center", width: "50%" }}>
            <img src="/src/assets/liverIcon.svg" width="10rem" />
            간수치 제한
          </div>
        )}
        {hasAgeLimit && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src="/src/assets/age.svg" width="10rem" />
            연령제한
          </div>
        )}
      </div>
    </div>
  );
};
export default meetingDetail;
