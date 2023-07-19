import styled from "styled-components";

const meetingDetail = () => {
  return (
    <div style={{ fontFamily: "Noto Sans KR", fontSize: "10px" }}>
      <div style={{ display: "flex" }}>
        <div style={{ display: "flex", alignContent: "center" }}>
          <img src="../src/assets/mapPin.svg" width="10rem"></img>
          모임위치
        </div>
        <div style={{ display: "flex", alignContent: "center" }}>
          <img src="../src/assets/calendar.svg" width="10rem" />
          모임시간
        </div>
      </div>
      <div>
        <span>img</span>
        <span>모임주최자</span>의 이름이 들어갑니다
      </div>
      <div style={{ display: "flex" }}>
        <div>
          <span>icon</span>간수치제한
        </div>
        <div>
          <span>icon</span>연령제한
        </div>
      </div>
    </div>
  );
};
export default meetingDetail;
