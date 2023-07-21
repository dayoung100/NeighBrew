import { styled } from "styled-components";
import DrinkCard from "./DrinkCard";
import singleShowcase from "./singleShowcase";
import { useState, useEffect } from "react";
import Navbar from "./../navbar/Navbar";
import Footer from "../footer/Footer";
import useIntersectionObserver from "./../../hooks/useIntersectionObserver";
import DrinkpostCreateButton from "./DrinkpostCreateButton";
import { useNavigate } from "react-router-dom";

const ShowcaseBody = styled.div`
  background-color: var(--c-black);
  color: white;
`;

// 무한 스크롤

const drinkpost = () => {
  const navigate = useNavigate();
  const drinkArray = new Array();
  for (let i = 1; i <= 5; i++) {
    // i <= num의 num부분을 수정하여 술병 갯수를 조정.
    drinkArray.push(i);
  }

  const [drinkList, setDrinkList] = useState(drinkArray);
  const onIntersect: IntersectionObserverCallback = ([{ isIntersecting }]) => {
    console.log(`감지결과 : ${isIntersecting}`);
    // isIntersecting이 true면 감지했다는 뜻임
    if (isIntersecting) {
      setPage(prev => prev + 1);
    }
  };
  const { setTarget } = useIntersectionObserver({ onIntersect });
  // 위의 두 변수로 검사할 요소를 observer로 설정
  const [dumy, setDumy] = useState<number[]>(drinkArray);
  const [page, setPage] = useState(1);
  // 여기에는 axios 요청 들어갈 예정
  useEffect(() => {
    setDumy(prev => [...prev, 1, 2, 3, 4, 5, 6, 7, 8]);
  }, [page]);

  return (
    <>
      <Navbar></Navbar>
      <ShowcaseBody>
        <h1 style={{ margin: "0px" }}>술장</h1>

        <div className="whole" style={{ display: "flex", flexWrap: "wrap", paddingBottom: "60px" }}>
          {dumy.map((drink, i) => {
            return <DrinkCard key={i} drinkId={drink}></DrinkCard>;
          })}
        </div>
        <div ref={setTarget} style={{ height: "100px", backgroundColor: "--c-black" }}></div>
      </ShowcaseBody>
      <DrinkpostCreateButton></DrinkpostCreateButton>
      <Footer></Footer>
    </>
  );
};

export default drinkpost;
