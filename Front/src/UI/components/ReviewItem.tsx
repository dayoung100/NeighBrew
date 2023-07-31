import styled from "styled-components";
import likeIcon from "../../assets/likeIcon.svg";
import { useState, useRef } from "react";
import { Review } from "../../Type/types";

const ReviewCard = styled.div`
  background-color: white;
  display: flex;
  justify-content: start;
  margin: 30px;
  width: 85%;
`;

const ReviewImg = styled.div`
  background-color: var(--c-gray);
  border-radius: 12px;
  min-width: 90px;
  height: 90px;
`;

const UserCard = styled.div`
  background-color: white;
  text-align: start;
  display: flex;
  justify-content: space-between;
  padding-bottom: 5px;
`;

const DescriptionP = styled.p`
  margin-left: 10px;
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
            <div>
              <img src={review.user.profile} alt="profile" />
              <span>
                <b>{review.user.name}</b>
              </span>
            </div>
            <div>
              <img src={likeIcon} alt="like" />
              <span>38</span>
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
