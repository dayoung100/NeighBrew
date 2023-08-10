import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { Drink } from "../../Type/types";
import backIcon from "../../assets/backIcon.svg";
import { callApi } from "../../utils/api";
import SearchBox from "./../components/SearchBox";
import DrinkCard from "./DrinkCard";

const Body = styled.div`
  background-color: white;
  height: 800px;
`;

const SearchDiv = styled.div`
  display: flex;
  justify-content: flex-end;
  background: var(--c-lightgray);
  border-radius: 20px;
  padding: 0.5rem 1rem;
`;

const ShowcaseBody = styled.div`
  font-size: 14px;
  display: flex;
  justify-content: center;
  margin-left: 3vw;
`;

const DrinkpostSearch = () => {
  const navigate = useNavigate();
  const [searchResult, setSearchResult] = useState<Drink[]>([]);
  const search = (drink: string) => {
    callApi("GET", `api/drink/search?name=${drink}`).then((res) => {
      setSearchResult(res.data.content);
    });
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
          <SearchDiv>
            <SearchBox
              placeholder="검색어를 입력하세요."
              changeFunc={search}
            ></SearchBox>
          </SearchDiv>
        </div>
      </div>
      <h3
        style={{
          display: "flex",
          justifyContent: "start",
          margin: "20px 0px 0px 20px",
        }}
      >
        검색결과
      </h3>
      <Body className="searchList">
        <ShowcaseBody>
          <div
            className="whole"
            style={{
              display: "flex",
              flexWrap: "wrap",
              paddingBottom: "60px",
            }}
          >
            {searchResult.map((drink) => {
              return <DrinkCard key={drink.drinkId} drink={drink}></DrinkCard>;
            })}
          </div>
        </ShowcaseBody>
      </Body>
    </>
  );
};
export default DrinkpostSearch;
