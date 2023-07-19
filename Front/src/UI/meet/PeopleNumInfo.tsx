/*
[PeopleNumInfo.tsx]
모임 리스트에 모임 인원 정보 출력
ListInfoItem에 props로 전달되어 numberInfo 내부에 들어감
자세한 props는 type PeopleNumProps 참고
*/
type PeopleNumProps = {
  now: number; //현재 인원
  max: number; //최대 인원
};

const PeopleNumInfo = (props: PeopleNumProps) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <img src="../src/assets/person.svg" width="10rem"></img>
      <div style={{ fontFamily: "Noto Sans KR", fontSize: "11px", margin: "0 3px" }}>
        {props.now}/{props.max}
      </div>
    </div>
  );
};
export default PeopleNumInfo;
