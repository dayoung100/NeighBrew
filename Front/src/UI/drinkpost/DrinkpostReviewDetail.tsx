import { Review, Drink, User } from "../../Type/types";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { callApi } from "../../utils/api";
import styled from "styled-components";
import { likeIcon, commentIcon } from "./../../assets/AllIcon";

const LikeAndComment = styled.div`
  display: flex;
  justify-content: space-around;
  width: 36%;
  margin-top: 1.5vh;
  font-size: 1.25rem;
`;

const Description = styled.div`
  text-align: start;
`;

const WholeDiv = styled.div`
  margin: 1.5rem;
`;

const ImageDiv = styled.div`
  background-color: var(--c-lightgray);
  border-radius: 1.875rem;
  width: 100%;
  height: 36vh;
`;

const Usercard = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4%;
  justify-content: space-between;
`;

const FollowDiv = styled.div`
  width: 5rem;
  height: 2rem;
  border-radius: 1.25rem;
  background-color: var(--c-yellow);
  display: flex;
  justify-content: center;
  align-items: center;
`;

// const ProfileDiv = styled.div`
//   width: 12%;
//   aspect-ratio: 1/1;
//   border-radius: 1.875rem;
//   background-color: var(--c-lightgray);
//   margin-right: 4%;
// `;

const UserImg = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  margin-right: 1rem;
`;

const DrinkpostReviewDetail = () => {
  const Like = likeIcon();
  const Comment = commentIcon();
  const { drinkId, reviewId } = useParams();
  const [review, setReview] = useState<Review>();
  const [drink, setDrink] = useState<Drink>();

  useEffect(() => {
    console.log();
    callApi("get", `api/drink/${drinkId}`)
      .then((res) => {
        console.log(res.data);
        setDrink(res.data);
      })
      .catch((err) => console.error(err));
    callApi("get", `api/drinkreview/review/${reviewId}`)
      .then((res) => {
        console.log(res.data);
        setReview(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  // useEffect(() => {
  //   callApi("get", ``);
  // });

  const clickLike = () => {
    callApi("post", `api/like/guard/${reviewId}`)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.error(err));
  };
  return (
    <>
      <WholeDiv>
        <h2>{drink?.name}</h2>
        <Usercard>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>
              <UserImg src={review?.user.profile}></UserImg>
            </div>
            {/* <ProfileDiv></ProfileDiv> */}
            <div>
              <b>{review?.user.nickname}</b>
            </div>
          </div>
          <FollowDiv>팔로우</FollowDiv>
        </Usercard>
        <ImageDiv></ImageDiv>
        <LikeAndComment>
          <div>
            {Like} {review?.likeCount}
          </div>

          <div>
            {Comment} {review?.drinkReviewId}
          </div>
        </LikeAndComment>
        <Description></Description>
        <hr />
        <div className="CommentList"></div>
      </WholeDiv>
    </>
  );
};
export default DrinkpostReviewDetail;
