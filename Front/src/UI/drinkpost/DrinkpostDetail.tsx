import Navbar from "../navbar/Navbar";
// import Footer from "../footer/Footer";
import { useNavigate, useParams } from "react-router-dom";
import whiskeyImage from "../../assets/whiskeyImage.png";
import ReviewItem from "../components/ReviewItem";
import styled from "styled-components";
import reviewIcon from "../../assets/reviewIcon.svg";
import backIcon from "../../assets/backIcon.svg";
import sirenIcon from "../../assets/sirenIcon.svg";
import { callApi } from "../../utils/api";
import { useState, useEffect } from "react";
import { Drink, Review } from "../../Type/types";

const CreateReviewDiv = styled.div`
  display: flex;
  justify-content: space-between;
  border: 1px solid var(--c-gray);
  border-radius: 12px;
  margin: 30px;
`;

const NavbarBackIcon = styled.div`
  margin-left: 10px;
  margin-top: 12px;
`;

const NavbarSirenIcon = styled.div`
  margin-right: 10px;
  margin-top: 6px;
`;

const DrinkpostDetailNavbar = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CreateReviewButton = styled.div`
  background-color: var(--c-yellow);
  border-radius: 12px;
  width: 30%;
  height: 100%;
  margin: 3px 15px 3px 15px;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const IconAndTextDiv = styled.div`
  margin: 10px 15px 10px 15px;
  display: flex;
  align-items: center;
  width: 30%;
`;

const DrinkpostDetail = () => {
  const { drinkId } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<Drink>();
  const [reviewList, setReviewList] = useState<Review[]>([]);

  // const drinkUrl = `http://34.64.126.58:5173/drink/${drinkId}`;
  // const reviewUrl = `http://34.64.126.58:5173/drinkreview/${drinkId}`;
  useEffect(() => {
    callApi("get", `api/drink/${drinkId}`)
      .then(res => {
        setDetail(res.data);
        console.log(1);
        console.log(res);
      })
      .catch(err => console.log(err));
    // callApi("get", reviewUrl)
    // .then(res=> )
  }, []);

  useEffect(() => {
    callApi("get", `api/drinkreview/${drinkId}`)
      .then(res => {
        setReviewList(prev => [...prev, ...res.data.content]);
        console.log(res.data.content);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <>
      <Navbar></Navbar>
      <DrinkpostDetailNavbar>
        <NavbarBackIcon onClick={() => navigate(-1)}>
          <img src={backIcon} alt="" />
        </NavbarBackIcon>
        <h2 style={{ margin: "12px 0px 8px 23px" }}>{detail?.name}</h2>
        <NavbarSirenIcon>
          <img src={sirenIcon} alt="" />
        </NavbarSirenIcon>
      </DrinkpostDetailNavbar>
      <img src={whiskeyImage} alt="" style={{ width: "80px", height: "300px", margin: "30px" }} />
      <div className="description" style={{ textAlign: "start", margin: "30px" }}>
        <p>
          <b>종류</b> : 종류를 받는 부분
        </p>
        <p>
          <b>도수</b> : {detail?.degree}도
        </p>
        <p>
          <b>국가</b> : 국가를 받는 부분
        </p>
        <p style={{ marginTop: "20px" }}>
          <b>설명</b> : {detail?.description}
        </p>
      </div>
      <div className="reviewBox">
        <CreateReviewDiv>
          <IconAndTextDiv>
            <img src={reviewIcon} alt="reviewIcon" />
            <p>후기 </p>
            <p>{reviewList.length}</p>
          </IconAndTextDiv>
          <CreateReviewButton>
            <span style={{ padding: "10px 0px 10px" }}>후기 작성하기</span>
          </CreateReviewButton>
        </CreateReviewDiv>
        <div className="reviewList">
          {reviewList.map(review => {
            return <ReviewItem key={review.drinkReviewId} review={review}></ReviewItem>;
          })}
        </div>
      </div>
      {/* <Footer></Footer> */}
    </>
  );
};
export default DrinkpostDetail;
