import Navbar from "../navbar/Navbar";
// import Footer from "../footer/Footer";
import { useNavigate, useParams } from "react-router-dom";
import whiskeyImage from "../../assets/whiskeyImage.png";
import ReviewItem from "../components/ReviewItem";
import styled from "styled-components";
import reviewIcon from "../../assets/reviewIcon.svg";
import { arrowLeftIcon } from "../../assets/AllIcon";
import sirenIcon from "../../assets/sirenIcon.svg";
import { callApi } from "../../utils/api";
import { useState, useEffect, useRef } from "react";
import { Drink, Review } from "../../Type/types";
import backgroundImg from "../../assets/mdsimg.png";

const WholeDiv = styled.div`
  border-radius: 30px 30px 0px 0px;
  background-color: white;
  min-height: 70vh;
  position: relative;
  z-index: 1;
  top: -2rem;
  padding: 1.5rem 2rem;
`;

const DrinkThumbnail = styled.div`
  background-image: url(${backgroundImg});
  background-size: cover;
  background-repeat: no-repeat;
  width: 100%;
  height: 30vh;
  color: white;
  display: flex;
  text-align: left;
`;

const InfoDiv = styled.div`
  display: flex;
  position: relative;
`;

const SimpleInfo = styled.div`
  text-align: center;
  width: 50%;
  word-wrap: break-word;
`;

const ImageInfo = styled.div`
  width: 40%;
  position: absolute;
  left: 70%;
  transform: translateX(-50%);
  bottom: 0;
`;

const CreateReviewDiv = styled.div`
  display: flex;
  justify-content: space-between;
  border: 1px solid var(--c-gray);
  border-radius: 12px;
  margin: 30px;
`;

const NavbarBackIcon = styled.div`
  margin-left: 1rem;
  margin-top: 1rem;
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

const MoreButton = styled.div`
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
  const { drinkId } = useParams();
  const navigate = useNavigate();
  const ArrowLeftIcon = arrowLeftIcon("white");
  const [showMore, setShowMore] = useState(false);
  const [detail, setDetail] = useState<Drink>();
  const [reviewList, setReviewList] = useState<Review[]>([]);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };
  const toReviewCreate = () => {
    navigate(`/drinkpost/${detail.drinkId}/review/create`);
  };
  // const drinkUrl = `http://34.64.126.58:5173/drink/${drinkId}`;
  // const reviewUrl = `http://34.64.126.58:5173/drinkreview/${drinkId}`;
  useEffect(() => {
    callApi("get", `api/drink/${drinkId}`)
      .then(res => {
        console.log(res.data);
        setDetail(res.data);
      })
      .catch(err => console.log(err));
    // callApi("get", reviewUrl)
    // .then(res=> )
  }, []);

  useEffect(() => {
    callApi("get", `api/drinkreview/${drinkId}`)
      .then(res => {
        console.log(res.data);
        setReviewList(prev => [...prev, ...res.data.content]);
      })
      .catch(err => console.error(err));
  }, []);

  const transImage = (img: string) => {
    if (img === "no image") {
      return whiskeyImage;
    } else if (img === "asd") {
      return whiskeyImage;
    } else {
      return detail?.image;
    }
  };

  const getTagNameMk2 = (tagId: number) => {
    if (tagId === 0) {
      return "전체";
    } else if (tagId === 1) {
      return "양주";
    } else if (tagId === 2) {
      return "전통주";
    } else if (tagId === 3) {
      return "칵테일";
    } else if (tagId === 4) {
      return "사케";
    } else if (tagId === 5) {
      return "와인";
    } else if (tagId === 6) {
      return "수제맥주";
    } else if (tagId === 7) {
      return "소주/맥주";
    }
  };
  return (
    <>
      <DrinkThumbnail>
        <NavbarBackIcon onClick={() => navigate("/drinkpost/")}>{ArrowLeftIcon}</NavbarBackIcon>
      </DrinkThumbnail>
      <WholeDiv>
        <InfoDiv>
          <SimpleInfo>
            <div style={{ textAlign: "center", marginLeft: "10vw" }}>
              <h3 style={{ marginRight: "2vw", textAlign: "start" }}>{detail?.name}</h3>
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <b style={{ marginRight: "2vw" }}>주종</b>
                {getTagNameMk2(detail?.tagId)}
              </div>
              <div style={{ paddingTop: "1vh", display: "flex", justifyContent: "flex-start" }}>
                <b style={{ marginRight: "2vw" }}>도수 </b>
                {detail?.degree}%
              </div>
            </div>
            <div
              onClick={toReviewCreate}
              style={{
                width: "24vw",
                height: "8vh",
                backgroundColor: "var(--c-yellow)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "20px",
                marginTop: "2vh",
                marginLeft: "8vw",
                cursor: "pointer",
              }}
            >
              <b>후기 {reviewList.length}</b>
              <div style={{ marginLeft: "6%", marginTop: "4%" }}>
                <img src={reviewIcon} alt="" />
              </div>
            </div>
          </SimpleInfo>
          <ImageInfo>
            <img src={transImage(detail?.image)} alt="" style={{ width: "12vh" }} />
          </ImageInfo>
        </InfoDiv>

        <div style={{}}>
          <DescriptionP className={showMore ? "show" : ""}>
            <hr />
            {detail?.description}
          </DescriptionP>
          {detail?.description.split("\n").length > 4 && (
            <MoreButton
              onClick={toggleShowMore}
              className={showMore ? "hide" : ""}
              style={{ textAlign: "start" }}
            >
              ...더보기
            </MoreButton>
          )}
        </div>

        <div className="reviewBox">
          <h1 style={{ textAlign: "start", marginBottom: "10px" }}>후기</h1>

          <div
            className="reviewList"
            style={{
              display: "flex",
              flexWrap: "wrap",

              justifyContent: "space-between",
            }}
          >
            {reviewList.map(review => {
              return <ReviewItem key={review.drinkReviewId} review={review}></ReviewItem>;
            })}
          </div>
        </div>
      </WholeDiv>
      {/* <Footer></Footer> */}
    </>
  );
};
export default DrinkpostDetail;
