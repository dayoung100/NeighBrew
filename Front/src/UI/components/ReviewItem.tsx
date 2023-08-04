import styled from "styled-components";
import likeIcon from "../../assets/likeIcon.svg";
import { useState, useRef } from "react";
import { Review } from "../../Type/types";
import { callApi } from "../../utils/api";

const ReviewCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 48%;
  height: auto;
  background-color: white;
  margin-bottom: 10px;
`;

const ReviewImg = styled.div`
  background-color: var(--c-gray);
  border-radius: 12px;
  width: 100%;
  height: 180px;
`;

const UserCard = styled.div`
  background-color: white;
  text-align: start;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 5px;
`;

const DescriptionP = styled.p`
  margin-left: 1vw;
  text-align: start;
  /* 추가하기 */
  display: -webkit-box;
  -webkit-line-clamp: 3;
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

const ReviewItem = ({ review }: { review: Review }) => {
  const [showMore, setShowMore] = useState(false);
  const [like, setLike] = useState(review.likeCount);
  const likeReview = () => {
    callApi("post", `api/like/guard/${review.drinkReviewId}`)
      .then(res => {
        console.log(res.data);
        setLike(prev => prev + 1);
      })
      .catch(err => console.error(err));
  };
  const toggleShowMore = () => {
    setShowMore(!showMore);
  };
  return (
    <>
      <ReviewCard>
        <ReviewImg>
          <img src={review.img} alt="reviewImg" />
        </ReviewImg>
        <div style={{ width: "100%" }}>
          <UserCard>
            <div style={{ display: "flex", paddingTop: "1vh" }}>
              <img
                src={review.user.profile}
                alt=""
                style={{
                  width: "6vw",
                  height: "auto",
                  borderRadius: "10px",
                  marginRight: "2vw",
                  marginLeft: "1vw",
                }}
              />

              <div>
                <b>{review.user.name}</b>
              </div>
            </div>

            <div style={{ cursor: "pointer" }} onClick={likeReview}>
              <img src={likeIcon} alt="like" />
              <span>{like}</span>
            </div>
          </UserCard>
          <div style={{ textAlign: "start" }}>
            <DescriptionP className={showMore ? "show" : ""}>{review?.content}</DescriptionP>
            {review?.content.length > 100 && (
              <MoreButton onClick={toggleShowMore} className={showMore ? "hide" : ""}>
                ...더보기
              </MoreButton>
            )}
          </div>
        </div>
      </ReviewCard>
    </>
  );
};
export default ReviewItem;
