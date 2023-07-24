import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { useNavigate } from "react-router-dom";
import whiskeyImage from "../../assets/whiskeyImage.png";
import ReviewItem from "../components/ReviewItem";
import styled from "styled-components";
import reviewIcon from "../../assets/reviewIcon.svg";
import backIcon from "../../assets/backIcon.svg";
import sirenIcon from "../../assets/sirenIcon.svg";

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
  return (
    <div>
      <Navbar></Navbar>
      <DrinkpostDetailNavbar>
        <NavbarBackIcon>
          <img src={backIcon} alt="" />
        </NavbarBackIcon>
        <h2 style={{ margin: "12px 0px 8px 23px" }}>술 이름</h2>
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
            <p>후기 </p>
            <p> 36</p>
          </IconAndTextDiv>
          <CreateReviewButton>
            <span style={{ padding: "10px 0px 10px" }}>후기 작성하기</span>
          </CreateReviewButton>
        </CreateReviewDiv>
        <div className="reviewList">
          <ReviewItem
            userId={3}
            image="reviewImage"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia quis nesciunt aliquid nulla eos nemo atque dolorem expedita, non reprehenderit. Quidem ad vero minima eum. Voluptatibus in reiciendis sunt et?"
          ></ReviewItem>
        </div>
      </div>
      {/* <Footer></Footer> */}
    </div>
  );
};
export default DrinkpostDetail;
