import styled from "styled-components";
import mdsPick from "../../assets/mdsimg.png";
import totaldrink from "../../assets/clickTotal.png";
import { useNavigate } from "react-router-dom";
import darkwood from "../../assets/darkwood.jpg";
import Navbar from "../navbar/NavbarForDrinkpost";
import Footer from "../footer/Footer";
import ReviewItem from "../components/ReviewItem";
import { useState, useEffect } from "react";
import { Review } from "../../Type/types";
import { callApi } from "../../utils/api";
import { forwardIcon } from "../../assets/AllIcon";

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
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 32px;
  color: white;
  display: flex;
  justify-content: end;
  align-items: end;
  font-size: 30px;
`;

// 한줄에 두개씩 보여주기
// 화면 비율 맞추기
const ReviewList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0px 10px 80px 10px;
`;

// 리뷰 카드
// 한줄에 두개씩 보여주기

// 리뷰 이미지
const ReviewImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 20px;
  object-fit: cover;
`;

const drinkpostMain = () => {
  const toForward = forwardIcon();
  const [reviewList, setReviewList] = useState<Review[]>([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const clickTotalDrink = () => {
    navigate("/drinkpost/total");
  };
  const toDrinkSearch = () => {
    navigate("/drinkpost/search");
  };

  useEffect(() => {
    callApi("get", "api/drinkreview/likes").then(res => {
      console.log(res.data);
      setReviewList(res.data);
    });
  }, []);

  return (
    <>
      <div>
        <Navbar toDrinkSearch={toDrinkSearch}></Navbar>
        <MdsDiv>
          <h3
            style={{
              margin: "0px 0px 0px 10px",
              padding: "10px",
              color: "white",
            }}
          >
            MD's Pick
          </h3>
        </MdsDiv>
        <DarkWood></DarkWood>
        <div style={{ margin: "30px 30px 30px 30px" }} onClick={clickTotalDrink}>
          <Total>
            <p style={{ marginBottom: "3%", marginRight: "5%" }}>모든 술 보기 {toForward}</p>
          </Total>
        </div>
        <div style={{ margin: "0px 5vw 0px 5vw" }}>
          <div style={{ textAlign: "start" }}>
            <h3>후기 모아보기</h3>
          </div>
          <ReviewList>
            {reviewList.map(review => {
              return <ReviewItem key={review.drinkReviewId} review={review}></ReviewItem>;
            })}
          </ReviewList>
        </div>
        <Footer></Footer>
      </div>
    </>
  );
};
export default drinkpostMain;
