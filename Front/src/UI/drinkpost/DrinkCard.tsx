// drinkcard

// 술장에 올려질 술 하나하나의 컴포넌트입니다.
// 큰 이미지 하나와 술의 이름으로 이루어져있습니다.

import styled from "styled-components";
import whiskeyImage from "../../assets/whiskeyImage.png";
import { useNavigate } from "react-router-dom";
import { Drink } from "../../Type/types";
import { useEffect, useState } from "react";
import { callApi } from "../../utils/api";

const Card = styled.div`
  flex-direction: column;
  display: flex;
  width: 30vw;
  height: 230px;
  margin: 10px 3px 10px 3px;
  border-radius: 14px;
  background-color: var(--c-lightgray);
  align-items: center;
  padding: 5px 3px 5px 3px;
`;

const CardImage = styled.img`
  width: 45px;
  height: 80%;
  margin: 10px;
`;
const TopTag = styled.div`
  width: 100%;
  display: flex;
  justify-content: end;
  margin: 5px 5px 0px 0px;
`;

// 글자수가 길면 글자 수 줄이기
const Tag = styled.div`
  height: 1rem;
  padding: 0.2rem 0.5rem 0.2rem 0.5rem;
  margin-right: 0.5rem;
  margin-top: 0.2rem;
  border-radius: 14px;
  font-size: 0.8rem;
  background-color: #f2bc79;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// 글씨 중간에  작성되도록 하는 css
const NameCard = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-radius: 14px;
  background-color: #ffffff;
  margin: 5px 5px 5px 5px;
  padding: 5px 0px 5px 0px;
  font-size: 12px;
  width: 85%;
  height: 7%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DrinkCard = ({ drink }: { drink: Drink }) => {
  const navigate = useNavigate();
  const toggleEllipsis = (str, limit) => {
    return {
      string: str.slice(0, limit),
    };
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

  const transImage = (img: string) => {
    if (img === "no image") {
      return whiskeyImage;
    } else if (img === "asd") {
      return whiskeyImage;
    } else {
      return drink.image;
    }
  };

  const [limit, setLimit] = useState(10);
  const moveToDrinkDetailHandler = () => {
    navigate(`/drinkpost/${drink.drinkId}`);
  };
  return (
    <Card onClick={() => moveToDrinkDetailHandler()}>
      <TopTag>
        <Tag>{getTagName(drink.tagId)}</Tag>
      </TopTag>
      <CardImage src={transImage(drink.image)}></CardImage>
      <NameCard>
        {drink.name.length < limit
          ? toggleEllipsis(drink.name, limit).string
          : toggleEllipsis(drink.name, limit).string + "..."}
      </NameCard>
    </Card>
  );
};

export default DrinkCard;
