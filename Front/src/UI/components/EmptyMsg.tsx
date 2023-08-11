import styled from "styled-components";
import { useState, useEffect } from "react";

const WrapperDiv = styled.div`
  padding: 2rem 0;
  color: var(--c-gray);
`;

const Title = styled.div`
  padding: 0.5rem;
  font-family: "JejuGothic";
  font-size: 20px;
`;

const Contents = styled.div`
  font-family: "NanumSquareNeo";
  font-size: 14px;
  white-space: pre-line;
  line-height: 130%;
`;

type EmptyMsgProps = {
  title: string;
  contents?: string;
};

const EmptyMsg = (props: EmptyMsgProps) => {
  return (
    <WrapperDiv>
      <img src="src/assets/placard.svg" />
      <Title>{props.title}</Title>
      <Contents>{props.contents}</Contents>
    </WrapperDiv>
  );
};
export default EmptyMsg;
