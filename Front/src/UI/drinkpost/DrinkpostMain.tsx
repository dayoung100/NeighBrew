import { styled } from "styled-components";
import DrinkCard from "./DrinkCard";
import singleShowcase from "./singleShowcase";
import { useState } from "react";
import Navbar from "./../navbar/Navbar";
import Footer from "../footer/Footer";

const ShowcaseBody = styled.div`
  background-color: var(--c-black);
  color: white;
`;

const drinkArray = new Array();
for (let i = 1; i <= 21; i++) {
  // i <= num의 num부분을 수정하여 술병 갯수를 조정.
  drinkArray.push(i);
}

const drinkpost = () => {
  const [drinkList, setDrinkList] = useState(drinkArray);

  return (
    <>
      <Navbar></Navbar>
      <ShowcaseBody>
        <h1 style={{ margin: "0px" }}>술장</h1>

        <div className="whole" style={{ display: "flex", flexWrap: "wrap", paddingBottom: "60px" }}>
          {drinkList.map((drink, i) => {
            return <DrinkCard key={i} drinkId={drink}></DrinkCard>;
          })}
        </div>
      </ShowcaseBody>
      <Footer></Footer>
    </>
  );
};

export default drinkpost;
