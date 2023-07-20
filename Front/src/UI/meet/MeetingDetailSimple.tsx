/*
[MeetingDetailSimple.tsx]
모임 리스트에 모임에 대한 간략 정보를 출력하는 부분
ListInfoItem에 props로 전달되어 content 내부에 들어감
모임 위치, 시간, 주최자, 간수치제한, 인원 제한 정보를 담고 있음
*/
const meetingDetail = () => {
  return (
    <div style={{ fontFamily: "Noto Sans KR", fontSize: "10px" }}>
      <div style={{ display: "flex" }}>
        <div style={{ display: "flex", alignContent: "center", width: "50%" }}>
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
        <div style={{ display: "flex", alignItems: "center", width: "50%" }}>
          <img src="../src/assets/liver.svg" width="10rem" />
          간수치제한
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src="../src/assets/age.svg" width="10rem" />
          연령제한
        </div>
      </div>
    </div>
  );
};
export default meetingDetail;
