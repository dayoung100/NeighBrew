import styled from "styled-components";

const LoadingDiv = styled.div`
  span {
    display: inline-block;
    vertical-align: middle;
    width: 0.6em;
    height: 0.6em;
    margin: 0.19em;
    background: white;
    border-radius: 0.6em;
    animation: loading 1s infinite alternate;
  }

  span:nth-of-type(2) {
    animation-delay: 0.2s;
  }
  span:nth-of-type(3) {
    animation-delay: 0.4s;
  }
  span:nth-of-type(4) {
    animation-delay: 0.6s;
  }
  span:nth-of-type(5) {
    animation-delay: 0.8s;
  }
  span:nth-of-type(6) {
    animation-delay: 1s;
  }
  span:nth-of-type(7) {
    animation-delay: 1.2s;
  }
  @keyframes loading {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

const LoadingRing = () => {
  return (
    <LoadingDiv>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </LoadingDiv>
  );
};

export default LoadingRing;
