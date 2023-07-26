import { styled } from "styled-components";
import SearchBox from "../components/SearchBox";
import backIcon from "../../assets/backIcon.svg";
import { useNavigate } from "react-router-dom";
import ListInfoItem from "../components/ListInfoItem";

import { useState } from "react";

const Body = styled.div`
  background-color: var(--c-lightgray);
  height: 800px;
`;

const SearchList = styled.div`
  margin: 0px 10px 0px 10px;
  padding-top: 10px;
`;

const DrinkpostSearch = () => {
  const navigate = useNavigate();
  const [searchWord, setSearchWord] = useState("");
  const [searchResult, setSearchResult] = useState<object[]>([1]);
  const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWord(e.target.value);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          margin: "15px 10px 0px 10px",
        }}
      >
        <div onClick={() => navigate(-1)}>
          <img src={backIcon} alt="" />
        </div>
        <div style={{ width: "85%" }}>
          <SearchBox placeholder="술 이름을 검색할 수 있습니다."></SearchBox>
        </div>
      </div>
      <h4 style={{ display: "flex", justifyContent: "start" }}>검색결과</h4>
      <Body className="searchList">
        <SearchList>
          {searchResult.map(drink => {
            return (
              <ListInfoItem
                title="주류"
                imgSrc="noImg"
                tag="주종"
                content="주류에 대한 간략한 정보가 여기에"
                numberInfo={"후기 수 " + 3}
                isWaiting={false}
                outLine={false}
                routingFunc={false}
              ></ListInfoItem>
            );
          })}
        </SearchList>
      </Body>
    </>
  );
};
export default DrinkpostSearch;
