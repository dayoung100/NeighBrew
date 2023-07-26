// 술장에 올려질 술 하나하나의 컴포넌트입니다.
// 큰 이미지 하나와 술의 이름으로 이루어져있습니다.

import styled from "styled-components";
import whiskeyImage from "../../assets/whiskeyImage.png";
import { useNavigate } from "react-router-dom";
import { Drink } from "../../Type/types";

const Card = styled.span`
  width: 33%;
  margin-bottom: 30px;
`;

const CardImage = styled.img`
  width: 45px;
  height: 125px;
  margin: 10px;
`;

const DrinkCard = ({ drink }: { drink: Drink }) => {
  const navigate = useNavigate();

  const moveToDrinkDetailHandler = () => {
    navigate(`/drinkpost/${drink.drinkId}`);
  };
  return (
    <Card onClick={() => moveToDrinkDetailHandler()}>
      <CardImage src={whiskeyImage}></CardImage>
      <p>{drink.name}</p>
    </Card>
  );
};

export default DrinkCard;
