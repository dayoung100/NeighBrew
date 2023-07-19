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
