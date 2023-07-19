type PeopleNumProps = {
  now: number;
  max: number;
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
