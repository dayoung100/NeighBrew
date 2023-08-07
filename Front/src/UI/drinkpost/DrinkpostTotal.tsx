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

const ShowcaseBody = styled.div`
  font-size: 0.875rem;
  margin-left: 1vw;
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
            .then((res) => {
              setDrinkList((prev) => [...prev, ...res.data.content]);
              setPage((prev) => prev + 1);
            })
            .catch((err) => {
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
          <h2 style={{ margin: "0rem 0rem 0rem .625rem" }}>네이브루의 술장</h2>
          {/* 실선 추가 */}
          {/* 회색 */}
          {/* 중앙정렬 */}
          <div
            style={{
              height: ".0625rem",
              backgroundColor: "#c4c4c4",
              margin: ".625rem 1.25rem .625rem 1.25rem",
            }}
          ></div>
        </div>

        <div
          className="whole"
          style={{
            display: "flex",
            flexWrap: "wrap",
            paddingBottom: "3.75rem",
          }}
        >
          {drinkList.map((drink) => {
            return <DrinkCard key={drink.drinkId} drink={drink}></DrinkCard>;
          })}
        </div>
        <div
          ref={setTarget}
          style={{
            marginTop: "6.25rem",
            height: ".3125rem",
            backgroundColor: "--c-black",
          }}
        ></div>
      </ShowcaseBody>
      <DrinkpostCreateButton></DrinkpostCreateButton>
      <Footer></Footer>
    </>
  );
};

export default drinkpostTotal;
