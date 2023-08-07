import { styled } from "styled-components";
import SearchBox from "../components/SearchBox";
import backIcon from "../../assets/backIcon.svg";
import { useNavigate } from "react-router-dom";
import ListInfoItem from "../components/ListInfoItem";
import { callApi } from "../../utils/api";
import { searchNavIcon } from "../../assets/AllIcon";
import { Drink } from "../../Type/types";
import DrinkCard from "./DrinkCard";

import { useEffect, useState } from "react";

const Body = styled.div`
  background-color: white;
  height: 50rem;
`;

const SearchList = styled.div`
  margin: 0rem 0.625rem 0rem 0.625rem;
  padding-top: 0.625rem;
`;

const SearchDiv = styled.div`
  display: flex;
  justify-content: flex-end;
  background: var(--c-lightgray);
  border-radius: 1.25rem;
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

const ShowcaseBody = styled.div`
  font-size: 0.875rem;
  display: flex;
  justify-content: center;
  margin-left: 3vw;
`;

const DrinkpostSearch = () => {
  const searchButton = searchNavIcon();
  const navigate = useNavigate();
  const [searchWord, setSearchWord] = useState("");
  const [sendSearch, setSendSearch] = useState(false);
  const [searchResult, setSearchResult] = useState<Drink[]>([]);

  const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchWord(e.target.value);
  };
  const sendSearchHandler = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    console.log(e.code);
    setSearchResult([]);
    if (e.code === "Enter" || e.keyCode === 13) {
      if (searchWord === "") return;
      if (e.keyCode == 229) return;
      // setSendSearch(prev => !prev);
      let data: Drink[] = [];
      await callApi("get", `api/drink/search?name=${searchWord}&size=10`).then(
        (res) => {
          data = res.data.content;
        }
      );
      await console.log(data);
      await setSearchResult((prev) => [...prev, ...data]);
      console.log(searchResult);
    }
  };

  const clickSearchHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSearchResult([]);
    if (searchWord === "") return;

    let data: Drink[] = [];
    await callApi("get", `api/drink/search?name=${searchWord}&size=10`).then(
      (res) => {
        data = res.data.content;
      }
    );
    await console.log(data);
    await setSearchResult((prev) => [...prev, ...data]);
    console.log(searchResult);
  };

  function getTagName(tagId: number) {
    const tag = [
      { tagId: 0, tagName: "전체" },
      { tagId: 1, tagName: "양주" },
      { tagId: 2, tagName: "전통주" },
      { tagId: 3, tagName: "전체" },
      { tagId: 4, tagName: "사케" },
      { tagId: 5, tagName: "와인" },
      { tagId: 6, tagName: "수제맥주" },
      { tagId: 7, tagName: "소주/맥주" },
    ];
    return tag[tagId].tagName;
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          margin: ".9375rem .625rem 0rem .625rem",
        }}
      >
        <div onClick={() => navigate(-1)}>
          <img src={backIcon} alt="" />
        </div>
        <div style={{ width: "85%" }}>
          <SearchDiv>
            <SearchDivInput
              type="text"
              placeholder="술을 검색해줭"
              value={searchWord}
              onChange={searchHandler}
              onKeyUp={sendSearchHandler}
            />
            <SearchBtn onClick={clickSearchHandler}>{searchButton}</SearchBtn>
          </SearchDiv>
        </div>
      </div>
      <h3
        style={{
          display: "flex",
          justifyContent: "start",
          margin: "1.25rem 0rem 0rem 1.25rem",
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
              paddingBottom: "3.75rem",
            }}
          >
            {searchResult.map((drink) => {
              return <DrinkCard key={drink.drinkId} drink={drink}></DrinkCard>;
            })}
          </div>
        </ShowcaseBody>
        {/* <SearchList>
          {searchResult.map(drink => {
            return (
              <div onClick={() => navigate(`/drinkpost/${drink.drinkId}`)}>
                <ListInfoItem
                  key={drink.drinkId}
                  title={drink.name}
                  imgSrc={drink.image}
                  tag={getTagName(drink.tagId)}
                  content={`${drink.degree}도`}
                  numberInfo={"후기 수 " + 3}
                  isWaiting={false}
                  outLine={false}
                  routingFunc={false}
                ></ListInfoItem>
              </div>
            );
          })}
        </SearchList> */}
      </Body>
    </>
  );
};
export default DrinkpostSearch;
