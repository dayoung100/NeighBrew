import styled from "styled-components";
import CocktailGlass from "../../assets/Loading/CocktailGlass.png";
import LoadingRing from "./LoadingRing";

const LoadingDiv = styled.div`
  background-color: #31edd3;
  min-height: 80vh;
  padding-top: 20vh;
  color: white;
`;

const CircleDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 20rem;
  height: 9rem;
  width: 9rem;
  margin: 4rem auto 4rem auto;
`;

const LoadingText = styled.div`
  font-family: "JejuGothic";
  font-size: 24px;
  margin: 1rem auto;
`;

const SubText = styled.div<{ size: number }>`
  font-family: "NanumSquareNeo";
  font-size: ${(props) => props.size}px;
  font-style: italic;
  margin: 0.5rem auto;
`;

const Loading = () => {
  return (
    <LoadingDiv>
      <LoadingText>로딩중...</LoadingText>
      <LoadingRing />
      <CircleDiv>
        <img src={CocktailGlass} />
      </CircleDiv>

      <SubText size={16}>Vodka martini, shaken, not stirred.</SubText>
      <SubText size={12}>- 007, James Bond</SubText>
    </LoadingDiv>
  );
};

export default Loading;
