import styled from "styled-components";
import whiskeyImage from "../../assets/whiskeyImage.png";
import { useNavigate } from "react-router-dom";
import { Drink } from "../../Type/types";
import { useState } from "react";

const Card = styled.div`
  flex-direction: column;
  display: flex;
  width: 28vw;
  height: 14.375rem;
  margin: 0.625rem 0.125rem 0.625rem 0.125rem;
  border-radius: 0.875rem;
  background-color: var(--c-lightgray);
  align-items: center;
  padding: 0.3125rem 0.1875rem 0.3125rem 0.1875rem;
`;

const CardImage = styled.img`
  width: 2.8125rem;
  height: 80%;
  margin: 0.625rem;
`;

const TopTag = styled.div`
  width: 100%;
  display: flex;
  justify-content: end;
  margin: 0.3125rem 0.3125rem 0rem 0rem;
`;

// 글자수가 길면 글자 수 줄이기
const Tag = styled.div`
  height: 1rem;
  padding: 0.2rem 0.5rem 0.2rem 0.5rem;
  margin-right: 0.5rem;
  margin-top: 0.2rem;
  border-radius: 0.875rem;
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
  border-radius: 0.875rem;
  background-color: #ffffff;
  margin: 0.3125rem 0.3125rem 0.3125rem 0.3125rem;
  padding: 0.3125rem 0rem 0.3125rem 0rem;
  font-size: 0.75rem;
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
