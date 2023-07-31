import { styled } from "styled-components";
import SearchBox from "../components/SearchBox";
import backIcon from "../../assets/backIcon.svg";
import { useNavigate } from "react-router-dom";
import ListInfoItem from "../components/ListInfoItem";
import { callApi } from "../../utils/api";
import { searchNavIcon } from "../../assets/AllIcon";
import { Drink } from "../../Type/types";

import React, { useEffect, useState } from "react";

const Body = styled.div`
  background-color: var(--c-lightgray);
  height: 800px;
`;

const SearchList = styled.div`
  margin: 0px 10px 0px 10px;
  padding-top: 10px;
`;

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
  const sendSearchHandler = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log(e.code);
    setSearchResult([]);
    if (e.code === "Enter" || e.keyCode === 13) {
      if (searchWord === "") return;
      if (e.keyCode == 229) return;
      // setSendSearch(prev => !prev);
      let data: Drink[] = [];
      await callApi("get", `api/drink/search?name=${searchWord}&size=2`).then(res => {
        data = res.data.content;
      });
      await console.log(data);
      await setSearchResult(prev => [...prev, ...data]);
      console.log(searchResult);
    }
  };

  const clickSearchHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSearchResult([]);
    if (searchWord === "") return;
    if (e.keyCode === 229) return;

    let data: Drink[] = [];
    await callApi("get", `api/drink/search?name=${searchWord}&size=2`).then(res => {
      data = res.data.content;
    });
    await console.log(data);
    await setSearchResult(prev => [...prev, ...data]);
    console.log(searchResult);
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
      <h4 style={{ display: "flex", justifyContent: "start" }}>검색결과</h4>
      <Body className="searchList">
        <SearchList>
          {searchResult.map(drink => {
            return (
              <div onClick={() => navigate(`/drinkpost/${drink.drinkId}`)}>
                <ListInfoItem
                  key={drink.drinkId}
                  title={drink.name}
                  imgSrc={drink.image}
                  tag={""}
                  content={`${drink.degree}도`}
                  numberInfo={"후기 수 " + 3}
                  isWaiting={false}
                  outLine={false}
                  routingFunc={false}
                ></ListInfoItem>
              </div>
            );
          })}
        </SearchList>
      </Body>
    </>
  );
};
export default DrinkpostSearch;
