import styled from "styled-components";
import mdsPick from "../../assets/mdsimg.png";
import totaldrink from "../../assets/totaldrink.png";
import { useNavigate } from "react-router-dom";
import darkwood from "../../assets/darkwood.jpg";
import Navbar from "../navbar/NavbarForDrinkpost";
import Footer from "../footer/Footer";
import ReviewItem from "../components/ReviewItem";
import { useState, useEffect } from "react";
import { Review } from "../../Type/types";
import { callApi } from "../../utils/api";

const MdsDiv = styled.div`
  width: 96%;
  height: 192px;
  border-radius: 20px 20px 0px 0px;
  background-image: url(${mdsPick});
  /* background-size: cover; */
  background-repeat: no-repeat;
  background-position: center;
  margin: 0px 2vw 0px 2vw;
  text-align: start;
`;

const DarkWood = styled.div`
  width: 100%;
  background-image: url(${darkwood});
  background-repeat: no-repeat;
  background-position: center;
  height: 24px;
`;

const Total = styled.div`
  max-width: 100vw;
  height: 120px;
  margin: 0px 10px 0px 10px;
  background-image: url(${totaldrink});
  /* background-size: cover; */
  background-repeat: no-repeat;
  background-position: center;
`;

const drinkpostMain = () => {
  const [reviewList, setReviewList] = useState<Review[]>([]);
  const navigate = useNavigate();
  const clickTotalDrink = () => {
    navigate("/drinkpost/total");
  };
  const toDrinkSearch = () => {
    navigate("/drinkpost/search");
  };

  useEffect(() => {
    callApi("get", "api/drinkreview/likes")
      .then(res => {
        console.log(res.data);
        setReviewList(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <div>
        <Navbar toDrinkSearch={toDrinkSearch}></Navbar>
        <MdsDiv>
          <h3 style={{ margin: "0px 0px 0px 10px", padding: "10px", color: "white" }}>MD's Pick</h3>
        </MdsDiv>
        <DarkWood></DarkWood>
        <div style={{ marginTop: "30px", marginBottom: "30px" }} onClick={clickTotalDrink}>
          <Total></Total>
        </div>
        <div style={{ margin: "0px 5vw 0px 5vw" }}>
          <div style={{ textAlign: "start" }}>
            <h3>후기 모아보기</h3>
          </div>
          <div
            className="reviewList"
            style={{
              display: "flex",
              flexWrap: "wrap",
              margin: "0px 0px 0px 0px",
              justifyContent: "space-between",
            }}
          >
            {reviewList.map(review => {
              return <ReviewItem key={review.drinkReviewId} review={review}></ReviewItem>;
            })}
          </div>
        </div>
        <Footer></Footer>
      </div>
    </>
  );
};
export default drinkpostMain;
