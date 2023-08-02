// 모임, 술장 등 주요 기능에서 사용되는 주종 카테고리를 나타내는 컴포넌트입니다.
// 이미지 소스는 Front/src/assets/AllDrinkCategories 경로에 tsx파일 형태로 있습니다.
// app.tsx는 충돌이 나기 쉬우므로 라우터 설정을 지워놓았습니다.
// 컴포넌트의 확인은 Front/App.tsx에 라우터 설정을 한 뒤 확인하시면 됩니다.

// 이 외 추가사항 : 전통주인 Tradition의 소스 파일인 'assets/AllDrinkCategories/Tradition.tsx에 오류 출력이 되는데 기능상 문제는 없어보입니다.

import { useState, useEffect } from "react";
import styled from "styled-components";
import { TotalDrink } from "../../assets/AllDrinkCategories/TotalDrink";
import { Whiskey } from "../../assets/AllDrinkCategories/Whiskey";
import { Tradition } from "../../assets/AllDrinkCategories/Tradition";
import { Cocktail } from "../../assets/AllDrinkCategories/Cocktail";
import { Wine } from "../../assets/AllDrinkCategories/Wine";
import { Sake } from "../../assets/AllDrinkCategories/Sake";
import { CraftBeer } from "../../assets/AllDrinkCategories/CraftBeer";
import { SojuBeer } from "../../assets/AllDrinkCategories/SojuBeer";

const CategoryDiv = styled.div`
  display: inline-block;
  border: none;
  margin: 6px;
`;

type DrinkCategoryProps = {
  getFunc: any;
};

/**
 * 주종 카테고리 선택 컴포넌트
 * @property {any} getFunc 태그 아이디 넘겨주는 함수
 */
const DrinkCategory = (props: DrinkCategoryProps) => {
  const [chooseCategoryDiv, setChooseCategoryDiv] = useState(0);
  //선택한 태그의 아이디를 부모로 넘김
  useEffect(() => {
    props.getFunc(chooseCategoryDiv);
  }, [chooseCategoryDiv]);

  const totalDrink = TotalDrink(chooseCategoryDiv === 0 ? "#f2bc79" : "#F0E5DC");
  const whiskey = Whiskey(chooseCategoryDiv === 1 ? "#F2BC79" : "#F0E5DC");
  const tradition = Tradition(chooseCategoryDiv === 2 ? "#F2BC79" : "#F0E5DC");
  const cocktail = Cocktail(chooseCategoryDiv === 3 ? "#F2BC79" : "#F0E5DC");
  const sake = Sake(chooseCategoryDiv === 4 ? "#F2BC79" : "#f0e5dc");
  const wine = Wine(chooseCategoryDiv === 5 ? "#F2BC79" : "#F0E5DC");
  const craftBeer = CraftBeer(chooseCategoryDiv === 6 ? "#F2BC79" : "#F0E5DC");
  const sojuAndBeer = SojuBeer(chooseCategoryDiv === 7 ? "#F2BC79" : "#F0E5DC");

  return (
    <div className="drinkCategories">
      <div className="first" style={{ width: "100%" }}>
        <CategoryDiv
          onClick={() => {
            setChooseCategoryDiv(0);
          }}
          autoFocus
        >
          {totalDrink}
        </CategoryDiv>

        <CategoryDiv
          onClick={() => {
            setChooseCategoryDiv(1);
          }}
        >
          {whiskey}
        </CategoryDiv>
        <CategoryDiv
          onClick={() => {
            setChooseCategoryDiv(2);
          }}
        >
          {tradition}
        </CategoryDiv>
        <CategoryDiv
          onClick={() => {
            setChooseCategoryDiv(3);
          }}
        >
          {cocktail}
        </CategoryDiv>
      </div>
      <div className="second" style={{ width: "100%" }}>
        <CategoryDiv
          onClick={() => {
            setChooseCategoryDiv(4);
          }}
        >
          {sake}
        </CategoryDiv>
        <CategoryDiv
          onClick={() => {
            setChooseCategoryDiv(5);
          }}
        >
          {wine}
        </CategoryDiv>
        <CategoryDiv
          onClick={() => {
            setChooseCategoryDiv(6);
          }}
        >
          {craftBeer}
        </CategoryDiv>
        <CategoryDiv
          onClick={() => {
            setChooseCategoryDiv(7);
          }}
        >
          {sojuAndBeer}
        </CategoryDiv>
      </div>
    </div>
  );
};
export default DrinkCategory;
