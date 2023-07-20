/*
[NavbarSimple.tsx]
상단바 간단한 버전
- 모임 관리, 모임 만들기, 술 정보 조회 등에 사용
뒤로 가기 버튼과 제목만 포함
*/
import { useNavigate } from "react-router-dom";
import { arrowLeftIcon } from "../../assets/AllIcon";
import styled from "styled-components";

const Title = styled.div`
  text-align: center;
  font-family: "JejuGothic";
  font-size: 20px;
`;

const ArrowBtn = styled.div`
  cursor: pointer;
  position: absolute;
  top: 1rem;
  left: 1rem;
`;

const NavbarSimple = ({ title }: { title: string }) => {
  const ArrowLeftIcon = arrowLeftIcon("var(--c-black)");
  const navigate = useNavigate();

  const GoBackHandler = () => {
    navigate(-1);
  };
  return (
    <div
      style={{
        padding: "1rem",
      }}
    >
      <Title>{title}</Title>
      <ArrowBtn onClick={GoBackHandler}>{ArrowLeftIcon}</ArrowBtn>
    </div>
  );
};

export default NavbarSimple;
