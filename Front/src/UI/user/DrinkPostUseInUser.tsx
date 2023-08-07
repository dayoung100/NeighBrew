// main
import { styled } from "styled-components";
import DrinkCard from "./../drinkpost/DrinkCard";
import { useState, useEffect } from "react";
import useIntersectionObserver from "./../../hooks/useIntersectionObserver";
import { callApi } from "../../utils/api";
import { Drink } from "../../Type/types";

const ShowcaseBody = styled.div`
  background-color: var(--c-black);
  color: white;
`;

// 무한 스크롤

const drinkpost = () => {
  const [page, setPage] = useState(0);
  const [drinkList, setDrinkList] = useState<Drink[]>([]);

  const onIntersect: IntersectionObserverCallback = ([{ isIntersecting }]) => {
    console.log(`감지결과 : ${isIntersecting}`);
    // isIntersecting이 true면 감지했다는 뜻임
    if (isIntersecting) {
      if (page < 6) {
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
      <ShowcaseBody>
        <h1 style={{ paddingTop: "10px" }}>내 술장</h1>

        <div className="whole" style={{ display: "flex", flexWrap: "wrap", paddingBottom: "60px" }}>
          {drinkList.map((drink, i) => {
            return <DrinkCard key={i} drink={drink}></DrinkCard>;
          })}
        </div>
        <div
          ref={setTarget}
          style={{ marginTop: "100px", height: "5px", backgroundColor: "--c-black" }}
        ></div>
      </ShowcaseBody>
    </>
  );
};

export default drinkpost;
