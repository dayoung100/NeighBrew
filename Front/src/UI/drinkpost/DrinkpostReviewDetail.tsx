import { Review, Drink, User } from "../../Type/types";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { callApi } from "../../utils/api";
import styled from "styled-components";
import { likeIcon, commentIcon } from "./../../assets/AllIcon";

const WholeDiv = styled.div`
  margin: 24px;
`;

const ImageDiv = styled.div`
  background-color: var(--c-lightgray);
  border-radius: 30px;
  width: 100%;
  height: 36vh;
`;

const Usercard = styled.div`
  display: flex;
`;

const LikeAndComment = styled.div`
  display: flex;
  justify-content: space-around;
  width: 36%;
  margin-top: 1.5vh;
  font-size: 20px;
`;

const Description = styled.div`
  text-align: start;
`;

type LikeState = {
  liked: boolean;
};

const DrinkpostReviewDetail = () => {
  const { drinkId, reviewId } = useParams();
  const [review, setReview] = useState<Review>();
  const [drink, setDrink] = useState<Drink>();
  const Like = likeIcon();
  const Comment = commentIcon();
  const [joayo, setJoayo] = useState<LikeState>(() => {
    const storedLiked = localStorage.getItem("liked");
    return storedLiked ? JSON.parse(storedLiked) : { liked: false };
  });

  useEffect(() => {
    localStorage.setItem("liked", JSON.stringify(joayo));
  }, [joayo]);

  // const clickLike = () => {
  //   callApi("post", `api/like/guard/${review.drinkReviewId}`)
  //     .then(res => {
  //       setLike({liked : !joayo.liked})
  //       console.log(res.data);
  //     })
  //     .catch(err => console.error(err));
  // };

  useEffect(() => {
    callApi("get", `api/drink/${drinkId}`)
      .then(res => {
        console.log(res.data);
        setDrink(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  // useEffect(() => {
  //   callApi("get", ``);
  // });

  const clickLike = () => {
    callApi("post", `api/like/guard/${reviewId}`)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => console.error(err));
  };
  return (
    <>
      <WholeDiv>
        <h2>{drink?.name}</h2>
        <Usercard>
          <div>
            {/* <div
              style={{
                borderRadius: "30px",
                backgroundImage: `url(${review?.user.profile})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            ></div> */}
            <div></div>
          </div>
        </Usercard>
        <ImageDiv></ImageDiv>
        <LikeAndComment>
          <div>{Like}14</div>

          <div>{Comment}23</div>
        </LikeAndComment>
        <Description></Description>
        <hr />
        <div className="CommentList"></div>
      </WholeDiv>
    </>
  );
};
export default DrinkpostReviewDetail;
