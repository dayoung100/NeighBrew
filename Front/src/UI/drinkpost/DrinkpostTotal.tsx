// main
import { styled } from "styled-components";
import DrinkCard from "./DrinkCard";
// import singleShowcase from "./singleShowcase";
import { useState, useEffect } from "react";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import DrinkpostCreateButton from "./DrinkpostCreateButton";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
import { callApi } from "../../utils/api";
import { Drink } from "../../Type/types";

const ShowcaseBody = styled.div`
  font-size: 14px;
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

const drinkpostTotal = () => {
  const [page, setPage] = useState(0);
  const [drinkList, setDrinkList] = useState<Drink[]>([]);

  // const navigate = useNavigate();

  const onIntersect: IntersectionObserverCallback = ([{ isIntersecting }]) => {
    console.log(`감지결과 : ${isIntersecting}`);
    // isIntersecting이 true면 감지했다는 뜻임
    if (isIntersecting) {
      if (page < 7) {
        setTimeout(() => {
          callApi("get", `api/drink?page=${page}&size=12`)
            .then(res => {
              setDrinkList(prev => [...prev, ...res.data.content]);
              console.log(res.data.content);
              console.log(drinkList);
              console.log(page);
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

  return (
    <>
      <Navbar></Navbar>
      <ShowcaseBody>
        <div style={{ textAlign: "start" }}>
          <h2 style={{ margin: "0px 0px 0px 10px" }}>네이브루의 술장</h2>
        </div>

        <div className="whole" style={{ display: "flex", flexWrap: "wrap", paddingBottom: "60px" }}>
          {drinkList.map(drink => {
            return <DrinkCard key={drink.drinkId} drink={drink}></DrinkCard>;
          })}
        </div>
        <div
          ref={setTarget}
          style={{ marginTop: "100px", height: "5px", backgroundColor: "--c-black" }}
        >
          내가 보여요?
        </div>
      </ShowcaseBody>
      <DrinkpostCreateButton></DrinkpostCreateButton>
      <Footer></Footer>
    </>
  );
};

export default drinkpostTotal;
