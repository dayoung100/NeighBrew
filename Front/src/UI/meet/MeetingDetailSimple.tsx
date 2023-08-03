import styled from "styled-components";

const InnerText = styled.div`
  width: 5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

type MeetingDetailProps = {
  position: string;
  time: string;
  hostId: number;
  liverLimit?: boolean;
  ageLimit?: boolean;
};

/**
 * 모임 리스트에 모임에 대한 간략 정보를 출력하는 부분.
 * ListInfoItem에 props로 전달되어 content 내부에 들어감
 * @property {string} position 모임 위치
 * @property {string} time 모임 시간
 * @property {number} hostId 모임 주최자 아이디
 * @property {boolean} liverLimit [Optional]간수치 제한
 * @property {boolean} ageLimit [Optional]연령 제한
 */
const meetingDetail = (props: MeetingDetailProps) => {
  return (
    <div style={{ fontFamily: "Noto Sans KR", fontSize: "10px" }}>
      <div style={{ display: "flex" }}>
        <div style={{ display: "flex", alignContent: "center", width: "50%" }}>
          <img src="/src/assets/mapPin.svg" width="10rem"></img>
          <InnerText>{props.position}</InnerText>
        </div>
        <div style={{ display: "flex", alignContent: "center" }}>
          <img src="/src/assets/calendar.svg" width="10rem" />
          {props.time}
        </div>
      </div>
      <div>
        <span>img</span>
        <span>{props.hostId}</span>의 이름이 들어갑니다
      </div>
      <div style={{ display: "flex" }}>
        {props.liverLimit && (
          <div style={{ display: "flex", alignItems: "center", width: "50%" }}>
            <img src="/src/assets/liverIcon.svg" width="10rem" />
            간수치 제한
          </div>
        )}
        {props.ageLimit && (
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
