/*
[MeetingDetail.tsx]
특정한 모임의 상세 정보를 보여주는 페이지
모임 리스트에서 하나를 클릭하면 이 페이지로 이동함
모임 타이틀, 태그, 주최자, 위치, 시간, 선택한 술, 모임 소개, 참여자 리스트 출력
*/
import { arrowLeftIcon } from "../../assets/AllIcon";

const MeetingDetail = () => {
  const ArrowLeftIcon = arrowLeftIcon("black");

  return (
    <div>
      <div>
        <div style={{ width: "100%", textAlign: "left" }}>
          {ArrowLeftIcon}
          뒤로가기 버튼과 태그
        </div>
        <div>모임의 제목이 들어갑니다</div>
        <div>주최자 이름이 들어갑니다</div>
        <div>인원정보가 여기에</div>
      </div>
      <div>자세한 정보는 여기에, radius를 줘야</div>
      <div>모임 예정 장소와 시간, z-index올리고 position absolute로</div>
    </div>
  );
};
export default MeetingDetail;
