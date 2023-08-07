import styled from "styled-components";
import likeIcon from "../../assets/likeIcon.svg";
import { useState, useEffect } from "react";
import { Review } from "../../Type/types";
import { callApi } from "../../utils/api";
import defaultBeerImage from "../../assets/Beer.jpg";
import { useNavigate } from "react-router-dom";

const ReviewCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 44%;
  height: auto;
  background-color: white;
  margin-bottom: 10px;
`;

const ReviewImg = styled.div`
  background-image: url(${defaultBeerImage});
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 12px;
  width: 100%;
  height: 150px;
`;

const UserCard = styled.div`
  background-color: white;
  text-align: start;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 5px;
`;

// 유저 닉네임
const UserNickname = styled.div`
  font-size: 0.6rem;
  font-weight: bold;
  margin-left: 1vw;
  margin-top: 1vh;
`;

// 유저 프로필 사진
const UserImg = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  margin-right: 1vw;
  margin-top: 1vh;
`;

// 길이가 길면 ...으로 표시
// MoreButton을 누르면 글이 전체로 표시
const DescriptionP = styled.p`
  font-size: 0.8rem;
  margin-left: 1vw;
  margin-right: 1vw;
  margin-top: 1vh;
  margin-bottom: 1vh;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4; /* 라인수 */
  -webkit-box-orient: vertical;

  &.show {
    -webkit-line-clamp: initial;
  }
  &.hide {
    -webkit-line-clamp: 2;
  }
`;

// 좋아요 버튼
// likeIcon을 누르면 좋아요 취소
const LikeButton = styled.button`
  width: 0.7rem;
  height: 0.7rem;
  background-color: white;
  border: none;
  background-image: url(${likeIcon});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  margin-right: 1vw;
  margin-top: 1vh;
  margin-bottom: 1vh;
  &.like {
    background-image: url(${likeIcon});
  }
  &.unlike {
    background-image: url(${likeIcon});
  }
`;

// 좋아요 수와 버튼
const LikeDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 1vw;
  margin-top: 1vh;
  margin-bottom: 1vh;
`;

// 좋아요 수
const LikeCount = styled.div`
  font-size: 0.6rem;
  margin-left: 0.3vw;
  margin-right: 0.3vw;
  margin-top: 1vh;
  margin-bottom: 1vh;
  color: #6e6e6e;
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
  const [like, setLike] = useState(false);
  const [likeCount, setLikeCount] = useState(review.likeCount);
  const toggleShowMore = () => {
    setShowMore(!showMore);
  };
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const toReviewDetail = () => {
    navigate(`/drinkpost/${review.drink.drinkId}/${review.drinkReviewId}`);
  };

  useEffect(() => {
    callApi("GET", `api/like/guard/${review.drinkReviewId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(res => {
      setLike(res.data);
    });
  }, [token, review.drinkReviewId]);

  useEffect(() => {
    callApi("GET", `api/drinkreview/review/${review.drinkReviewId}`)
      .then(res => {
        setLikeCount(res.data.likeCount);
      })
      .catch(err => {
        console.log(err);
      });
  }, [review.drinkReviewId, likeCount]);

  // 좋아요 버튼 누르면 좋아요 수 증가
  // 즉시반영
  const likeHandler = () => {
    callApi("POST", `api/like/guard/${review.drinkReviewId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => {
      if (!like) {
        setLikeCount((prev) => prev + 1);
      } else {
        setLikeCount((prev) => prev - 1);
      }
    });
    setLike(!like);
  };

  return (
    <>
      <ReviewCard>
        <ReviewImg onClick={toReviewDetail}></ReviewImg>
        <div style={{ width: "100%" }}>
          <UserCard>
            <div style={{ display: "flex", paddingTop: "1vh" }}>
              <UserImg src={review.user.profile} />

              <div>
                <UserNickname>{review.user.nickname}</UserNickname>
              </div>
            </div>

            <LikeDiv>
              <LikeButton
                // className={like ? "like" : "unlike"}
                onClick={likeHandler}
              />
              <LikeCount>{likeCount}</LikeCount>
            </LikeDiv>
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
