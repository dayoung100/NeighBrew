import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { useNavigate } from "react-router-dom";
import whiskeyImage from "../../assets/whiskeyImage.png";
import ReviewItem from "../components/ReviewItem";
import styled from "styled-components";
import reviewIcon from "../../assets/reviewIcon.svg";

const CreateReviewDiv = styled.div`
  display: flex;
  justify-content: space-between;
  border: 1px solid var(--c-gray);
  border-radius: 12px;
  margin: 30px;
`;

const CreateReviewButton = styled.div`
  background-color: var(--c-yellow);
  border-radius: 12px;
  width: 100px;
  height: 30px;
  margin: 10px 15px 10px 15px;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const IconAndTextDiv = styled.div`
  margin: 15px 150px 10px 15px;
`;

const DrinkpostDetail = () => {
  return (
    <div>
      <h3 style={{ margin: "0px" }}> 술 이름을 받는 부분</h3>
      <img src={whiskeyImage} alt="" style={{ width: "80px", height: "300px", margin: "30px" }} />
      <div className="description" style={{ textAlign: "start", margin: "30px" }}>
        <p>
          <b>종류</b> : 종류를 받는 부분
        </p>
        <p>
          <b>도수</b> : 도수를 받는 부분
        </p>
        <p>
          <b>국가</b> : 국가를 받는 부분
        </p>
      </div>
      <div className="reviewBox">
        <CreateReviewDiv>
          <IconAndTextDiv>
            <img src={reviewIcon} alt="reviewIcon" />
            <span>후기</span>
          </IconAndTextDiv>
          <CreateReviewButton>후기 작성하기</CreateReviewButton>
        </CreateReviewDiv>
        <div className="reviewList">
          <ReviewItem></ReviewItem>
        </div>
      </div>
    </div>
  );
};

export default DrinkpostDetail;
