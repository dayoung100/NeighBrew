// 술장에 올려질 술 하나하나의 컴포넌트입니다.
// 큰 이미지 하나와 술의 이름으로 이루어져있습니다.

import styled from "styled-components";
import whiskeyImage from "../../assets/whiskeyImage.png";
import { useNavigate } from "react-router-dom";

const Card = styled.span`
  width: 25%;
  margin-bottom: 30px;
`;

const CardImage = styled.img`
  width: 45px;
  height: 125px;
  margin: 10px;
`;

type drink = {
  drinkId: number;
};

const DrinkCard = (props: { drink: object }) => {
  const navigate = useNavigate();
  const moveToDrinkDetailHandler = () => {
    navigate(`/drinkpost/${props.drink.drinkId}`);
  };
  return (
    <Card onClick={() => moveToDrinkDetailHandler()}>
      <CardImage src={whiskeyImage}></CardImage>
      <p>{props.drink.name}</p>
    </Card>
  );
};

export default DrinkCard;
