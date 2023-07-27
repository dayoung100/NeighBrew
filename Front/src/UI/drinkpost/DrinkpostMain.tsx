// main
import { styled } from "styled-components";
import DrinkCard from "./DrinkCard";
// import singleShowcase from "./singleShowcase";
import { useState, useEffect } from "react";
import Navbar from "./../navbar/Navbar";
import Footer from "../footer/Footer";
import useIntersectionObserver from "./../../hooks/useIntersectionObserver";
import DrinkpostCreateButton from "./DrinkpostCreateButton";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import { callApi } from "../../utils/api";
import { Drink } from "../../Type/types";

const ShowcaseBody = styled.div`
  background-color: var(--c-black);
  color: white;
`;

// export type DrinkType = {
//   drinkId: number;
//   name: string;
//   description: string;
//   degree: number;
//   tagId: number;
//   image: string;
// };

// 무한 스크롤

const drinkpost = () => {
  const [page, setPage] = useState(0);
  const url = `http://34.64.126.58:5173/drink?page=${page}&size=12`;
  const navigate = useNavigate();

  const onIntersect: IntersectionObserverCallback = ([{ isIntersecting }]) => {
    console.log(`감지결과 : ${isIntersecting}`);
    // isIntersecting이 true면 감지했다는 뜻임
    if (isIntersecting) {
      setPage(prev => prev + 1);
    }
  };
  const { setTarget } = useIntersectionObserver({ onIntersect });
  // 위의 두 변수로 검사할 요소를 observer로 설정
  const [drinkList, setDrinkList] = useState<Drink[]>([]);
  // 여기에는 axios 요청 들어갈 예정
  useEffect(() => {
    callApi("get", `api/drink?page=${page}&size=12`)
      .then(res => {
        setDrinkList(prev => [...prev, ...res.data.content]);
        console.log(res.data);
        console.log(drinkList);
      })
      .catch(err => {
        console.log(err);
      });
  }, [page]);

  return (
    <>
      <Navbar></Navbar>
      <ShowcaseBody>
        <h1 style={{ margin: "0px" }}>술장</h1>

        <div className="whole" style={{ display: "flex", flexWrap: "wrap", paddingBottom: "60px" }}>
          {drinkList.map(drink => {
            return <DrinkCard key={drink.drinkId} drink={drink}></DrinkCard>;
          })}
        </div>
        <div
          ref={setTarget}
          style={{ marginTop: "1000px", height: "100px", backgroundColor: "--c-black" }}
        >
          내가 보여요?
        </div>
      </ShowcaseBody>
      <DrinkpostCreateButton></DrinkpostCreateButton>
      <Footer></Footer>
    </>
  );
};

export default drinkpost;
