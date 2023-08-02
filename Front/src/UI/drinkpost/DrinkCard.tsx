// drinkcard

// 술장에 올려질 술 하나하나의 컴포넌트입니다.
// 큰 이미지 하나와 술의 이름으로 이루어져있습니다.

import styled from "styled-components";
import whiskeyImage from "../../assets/whiskeyImage.png";
import { useNavigate } from "react-router-dom";
import { Drink } from "../../Type/types";
import { useState } from "react";

const Card = styled.div`
  flex-direction: column;
  display: flex;
  width: 30%;
  height: 230px;
  margin: 10px 3px 10px 3px;
  border-radius: 14px;
  background-color: var(--c-lightgray);
  align-items: center;
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

const Tag = styled.div`
  min-width: 65px;
  max-width: 150px;
  height: 20px;
  border-radius: 14px;

  background-color: var(--c-yellow);
`;

const NameCard = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-radius: 14px;
  background-color: #ffffff;
  margin: 5px 5px 5px 5px;
  padding: 5px 0px 5px 0px;
  font-size: 12px;
  width: 90%;
  height: 10%;
  font-weight: bold;
`;

const DrinkCard = ({ drink }: { drink: Drink }) => {
  const navigate = useNavigate();
  const toggleEllipsis = (str, limit) => {
    return {
      string: str.slice(0, limit),
    };
  };
  const tagHandler = tagId => {
    if (tagId === 1) {
      return "양주";
    } else if (tagId === 2) {
      return "전통주";
    } else if (tagId === 3) {
      return "칵테일";
    } else if (tagId === 4) {
      return "사케";
    } else if (tagId === 5) {
      return "와인";
    } else if (tagId === 6) {
      return "수제맥주";
    } else if (tagId === 7) {
      return "소주/맥주";
    } else if (tagId === 8) {
    }
  };

  const [limit, setLimit] = useState(10);
  const moveToDrinkDetailHandler = () => {
    navigate(`/drinkpost/${drink.drinkId}`);
  };
  return (
    <Card onClick={() => moveToDrinkDetailHandler()}>
      <TopTag>
        <Tag>{tagHandler(drink.tagId)}</Tag>
      </TopTag>
      <CardImage src={drink.image ? drink.image : whiskeyImage}></CardImage>
      <NameCard>
        {drink.name.length < limit
          ? toggleEllipsis(drink.name, limit).string
          : toggleEllipsis(drink.name, limit).string + "..."}
      </NameCard>
    </Card>
  );
};

export default DrinkCard;
