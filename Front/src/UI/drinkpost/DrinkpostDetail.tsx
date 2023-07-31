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
import { useState, useEffect, useRef } from "react";
import { Drink, Review, User } from "../../Type/types";

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

const DescriptionP = styled.p`
  margin-top: 20px;
  text-align: start;
  /* 추가하기 */
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  &.show {
    display: block;
    max-height: none;
    overflow: auto;
    -webkit-line-clamp: unset;
  }
`;

const MoreButton = styled.button`
  max-height: 2rem;
  line-height: 2rem;
  border: none;

  background: rgb(2, 0, 36);
  background: linear-gradient(
    90deg,
    rgba(2, 0, 36, 1) 0%,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 1) 18%
  );
  &.hide {
    display: none;
  }
`;

const DrinkpostDetail = () => {
  const contentRef = useRef(null);
  const moreBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
    contentRef.current.classList.add("show");
    e.currentTarget.classList.add("hide");
  };

  const { drinkId } = useParams();
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);
  const [detail, setDetail] = useState<Drink>();
  const [reviewList, setReviewList] = useState<Review[]>([]);
  const toggleShowMore = () => {
    setShowMore(!showMore);
  };
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
        <NavbarBackIcon onClick={() => navigate("/drinkpost/")}>
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
        <DescriptionP className={showMore ? "show" : ""}>
          <b>설명</b> : {detail?.description}
        </DescriptionP>
        {detail?.description.split("\n").length > 4 && (
          <MoreButton onClick={toggleShowMore} className={showMore ? "hide" : ""}>
            ...더보기
          </MoreButton>
        )}
      </div>
      <div className="reviewBox">
        <CreateReviewDiv>
          <IconAndTextDiv>
            <img src={reviewIcon} alt="reviewIcon" />
            <p>후기 </p>
            <p>{reviewList.length}</p>
          </IconAndTextDiv>
          <CreateReviewButton onClick={() => navigate(`/drinkpost/${drinkId}/review/create`)}>
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
