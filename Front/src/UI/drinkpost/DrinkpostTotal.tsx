// main
import { styled } from "styled-components";
import DrinkCard from "./DrinkCard";
import { useState, useEffect } from "react";
import Navbar from "../navbar/NavbarForDrinkpost";
import Footer from "../footer/Footer";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import DrinkpostCreateButton from "./DrinkpostCreateButton";
import { useNavigate } from "react-router-dom";
import { callApi } from "../../utils/api";
import { Drink } from "../../Type/types";
import plusButton from "../../assets/plusButton.svg";

const ShowcaseBody = styled.div`
  font-size: 14px;
  margin-left: 1vw;
`;

const RoundBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 10%;

  background: var(--c-yellow);
  width: 4rem;
  height: 4rem;
  border-radius: 100px;
  z-index: 10;

  @media (max-width: 430px) {
    right: 5%;
  }
  @media (min-width: 431px) {
    left: 350px;
  }
`;

// 무한 스크롤

const drinkpostTotal = () => {
  const [page, setPage] = useState(0);
  const [drinkList, setDrinkList] = useState<Drink[]>([]);
  const navigate = useNavigate();
  // const navigate = useNavigate();

  const onIntersect: IntersectionObserverCallback = ([{ isIntersecting }]) => {
    console.log(`감지결과 : ${isIntersecting}`);
    // isIntersecting이 true면 감지했다는 뜻임
    if (isIntersecting) {
      if (page < 10) {
        setTimeout(() => {
          callApi("get", `api/drink?page=${page}&size=12`)
            .then(res => {
              setDrinkList(prev => [...prev, ...res.data.content]);
              setPage(prev => prev + 1);
            })
            .catch(err => {
              console.log(err);
            });
          console.log(page);
        }, 100);
      }
    }
  };
  const { setTarget } = useIntersectionObserver({ onIntersect });
  // 위의 두 변수로 검사할 요소를 observer로 설정
  // 여기에는 axios 요청 들어갈 예정
  const toDrinkSearch = () => {
    navigate("/drinkpost/search");
  };
  return (
    <>
      <Navbar toDrinkSearch={toDrinkSearch}></Navbar>
      <ShowcaseBody>
        <div style={{ textAlign: "start" }}>
          <h2 style={{ margin: "0px 0px 0px 10px" }}>네이브루의 술장</h2>
          {/* 실선 추가 */}
          {/* 회색 */}
          {/* 중앙정렬 */}
          <div
            style={{
              height: "1px",
              backgroundColor: "#c4c4c4",
              margin: "10px 20px 10px 20px",
            }}
          ></div>
        </div>

        <div
          className="whole"
          style={{ display: "flex", flexWrap: "wrap", paddingBottom: "60px", marginLeft: "1px" }}
        >
          {drinkList.map(drink => {
            return <DrinkCard key={drink.drinkId} drink={drink}></DrinkCard>;
          })}
        </div>
        <div
          ref={setTarget}
          style={{
            marginTop: "100px",
            height: "5px",
            backgroundColor: "--c-black",
          }}
        ></div>
      </ShowcaseBody>
      <RoundBtn>
        <img src={plusButton} width="25rem" />
      </RoundBtn>
      {/* <DrinkpostCreateButton></DrinkpostCreateButton> */}
      <Footer></Footer>
    </>
  );
};

export default drinkpostTotal;
