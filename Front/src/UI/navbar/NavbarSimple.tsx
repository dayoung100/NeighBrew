import { useNavigate } from "react-router-dom";
import { arrowLeftIcon } from "../../assets/AllIcon";
import styled from "styled-components";

const Title = styled.div`
  text-align: center;
  font-family: "JejuGothic";
  font-size: 20px;
  width: 95%;
`;

const ArrowBtn = styled.div`
  cursor: pointer;
  /* position: absolute; */
  top: 1rem;
  left: 1rem;
  width: 5%;
`;

/**
 * 상단바 간단한 버전.
 * 모임 관리, 모임 만들기, 술 정보 조회 등에 사용.
 * 뒤로 가기 버튼과 제목만 포함
 * @property {string} title 상단에 들어갈 제목
 */
const NavbarSimple = ({ title }: { title: string }) => {
  const ArrowLeftIcon = arrowLeftIcon("var(--c-black)");
  const navigate = useNavigate();

  const GoBackHandler = () => {
    navigate(-1);
  };
  return (
    <div
      style={{
        display: "flex",
        padding: "1rem",
        background: "white",
      }}
    >
      <ArrowBtn onClick={GoBackHandler}>{ArrowLeftIcon}</ArrowBtn>
      <Title>{title}</Title>
    </div>
  );
};

export default NavbarSimple;
