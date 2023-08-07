/*
[SearchBox.tsx]
검색창 컴포넌트, 서치 버튼 포함
추후 검색 버튼 클릭시 적용될 함수를 props에서 받도록 수정 예정
자세한 props는 type InputProps 참고
*/
import styled from "styled-components";
import { searchNavIcon } from "../../assets/AllIcon";

const SearchDiv = styled.div`
  display: flex;
  justify-content: flex-end;
  background: var(--c-lightgray);
  border-radius: 20px;
  padding: 0.5rem 1rem;
`;

const SearchDivInput = styled.input.attrs({ type: "text" })`
  background: var(--c-lightgray);
  color: var(--c-black);
  font-family: "SeoulNamsan";
  width: 80%;
  border: none;
  text-align: right;
  outline: none;
`;

const SearchBtn = styled.button`
  background-size: 100%;
  width: 1.5rem;
  height: 1.5rem;
  border: none;
`;

type InputProps = {
  placeholder: string; //아무것도 입력하지 않았을 때 표시될 문구
  value?: string; //입력창에 입력된 값
  changeFunc?(input: string): void; //변경될때 시행할 함수
};

//TODO:추후 검색 버튼 클릭시 적용될 함수를 props에서 받도록 수정 예정
//TODO: 실시간 검색을 위해 value와 changeFunc 추가
/**
 * 검색창 컴포넌트, 서치 버튼 포함.
 * @property {string} placeholder 아무것도 입력하지 않았을 때 표시될 문구
 * @todo 추후 검색 버튼 클릭시 적용될 함수를 props에서 받도록 수정 예정
 */
const searchBox = (props: InputProps) => {
  const searchButton = searchNavIcon();

  return (
    <SearchDiv>
      <SearchDivInput
        type="text"
        placeholder={props.placeholder}
        value={props.value}
        onChange={e => props.changeFunc(e.target.value)}
      />
      <SearchBtn
        onClick={() => {
          console.log("search!");
        }}
      >
        {searchButton}
      </SearchBtn>
    </SearchDiv>
  );
};

export default searchBox;
