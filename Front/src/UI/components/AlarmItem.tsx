import styled from "styled-components";
import defaultImg from "../../assets/defaultImg.png";
// 임시 타입입니다. 후에 api를 받아오고 형식이 정해지면 types에 interface로 만들겠습니다.
type AlarmProps = {
  alarm: string;
};

const ItemDiv = styled.div`
  display: flex;
  margin: 12px 0px 12px 0px;
`;

const ProfileDiv = styled.div`
  width: 100%;
  height: 100%;
  aspect-ratio: 1/1;
  border-radius: 30px;
  background-size: cover;
  background-repeat: no-repeat;
`;

const AlarmContent = styled.div`
  // 폰트 맘에 드는거 비교해보라고 둘 다 해놨습니다.
  font-family: "NanumSquareNeo";
  /* font-family: "JejuGothic"; */
  word-break: break-all;
  text-align: start;
`;

const alarmItem: React.FC<AlarmProps> = ({ alarm }) => {
  return (
    <>
      <ItemDiv>
        <div style={{ width: "36px", height: "36px", marginRight: "12px" }}>
          <ProfileDiv style={{ backgroundImage: `url(${defaultImg})` }}></ProfileDiv>
        </div>
        <AlarmContent>{alarm}</AlarmContent>
      </ItemDiv>
    </>
  );
};
export default alarmItem;
