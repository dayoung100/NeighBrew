import React from "react";
import styled from "styled-components";
import { Meeting, User } from "../../Type/types";
import defaultImg from "../../assets/defaultImg.png";

const InnerText = styled.div<{ $widthRem: number }>`
  width: ${(props) => props.$widthRem}rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const UserProfileImg = styled.div<{ src: string }>`
  background: url(${(props) => props.src}) no-repeat center;
  background-size: cover;
  width: 1rem;
  padding-bottom: 1rem;
  border-radius: 100px;
  margin-right: 0.2rem;
`;

/**
 * 모임 리스트에 모임에 대한 간략 정보를 출력하는 부분.
 * ListInfoItem에 props로 전달되어 content 내부에 들어감
 */
const meetingDetail = ({ meetData }: { meetData: Meeting }) => {
  function formateDate(dateData: string) {
    const date = new Date(dateData);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();

    return `${month}월 ${day}일 ${hour}시 ${minute}분`;
  }

  const position = `${meetData.sido.sidoName} ${meetData.gugun.gugunName}`;
  const formattedDate = formateDate(meetData.meetDate);
  const hasAgeLimit =
    (meetData.minAge ?? 0) > 0 || (meetData.maxAge ?? 0) > 0 ? true : false;
  const hasLiverLimit = (meetData.minLiverPoint ?? 0) > 0 ? true : false;

  return (
    <div style={{ fontFamily: "Noto Sans KR", fontSize: "10px" }}>
      <div style={{ display: "flex" }}>
        <div style={{ display: "flex", alignContent: "center", width: "50%" }}>
          <img src="/src/assets/mapPin.svg" width="10rem"></img>
          <InnerText $widthRem={5}>{position}</InnerText>
        </div>
        <div style={{ display: "flex", alignContent: "center" }}>
          <img src="/src/assets/calendar.svg" width="10rem" />
          <InnerText $widthRem={6}>{formattedDate}</InnerText>
        </div>
      </div>
      <InnerText $widthRem={12}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <UserProfileImg
            src={
              meetData.host.profile === "no image"
                ? defaultImg
                : meetData.host.profile
            }
          />
          <div>{meetData.host.nickname}</div>
        </div>
      </InnerText>
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
export default React.memo(meetingDetail);
