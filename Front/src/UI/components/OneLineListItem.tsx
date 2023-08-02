/*
[OneLineListItem.tsx]
모임 생성 시 주류 검색, 또는 유저 평가 세부 항목에 들어가는 컴포넌트
요소 별 구분을 위한 밑줄이 포함되어 있음
자세한 props는 type ListInfoItemProps 참고
*/
import styled from "styled-components";

const ItemDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 90%;
  margin: 0 auto;
  padding: 0.5rem;
  border-bottom: 0.5px solid var(--c-gray);
  font-family: "SeoulNamsan";
  font-size: 12px;
`;

const Tag = styled.div`
  background: var(--c-yellow);
  padding: 1.5% 7%;
  font-size: 7px;
  border-radius: 10px;
`;

//TODO: 어차피 리스트의 객체를 갖고 돌릴꺼니까 getFunc없어도 될듯
//TODO: 인자로 받는 것도 content, tag말고 객체 자체를 받아도 될듯
type OneLineListItemProps = {
  content: string; //항목의 이름
  tag: string; //항목이 해당하는 태그(주종, 좋아요/보통/아쉬워요 등)
  getFunc?: any; //getter 함수. 이 컴포넌트를 클릭시 해당하는 후기나 주류의 정보를 넘겨줌
};

/**
 * 모임 생성 시 주류 검색, 또는 유저 평가 세부 항목에 들어가는 컴포넌트.
 * 요소 별 구분을 위한 밑줄이 포함되어 있음
 * @property {string} content 항목의 이름
 * @property {string} tag 항목이 해당하는 태그(주종, 좋아요/보통/아쉬워요 등)
 * @property {any} getFunc getter 함수. 이 컴포넌트를 클릭시 해당하는 후기나 주류의 정보를 넘겨줌
 */
const OneLineListItem = (props: OneLineListItemProps) => {
  return (
    <ItemDiv onClick={() => {}}>
      <div>{props.content}</div>
      <Tag>{props.tag}</Tag>
    </ItemDiv>
  );
};
export default OneLineListItem;
