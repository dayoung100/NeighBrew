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
`;

const SearchBtn = styled.button`
  background-size: 100%;
  width: 1.5rem;
  height: 1.5rem;
  border: none;
`;

type InputProps = {
  placeholder: string;
};

const searchBox = (props: InputProps) => {
  const searchButton = searchNavIcon();

  return (
    <SearchDiv>
      <SearchDivInput type="text" placeholder={props.placeholder} />
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
