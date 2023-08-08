import { Review, Drink, User } from "../../Type/types";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { callApi } from "../../utils/api";
import styled from "styled-components";
import { likeIcon, commentIcon } from "./../../assets/AllIcon";

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
  align-items: center;
  margin-bottom: 4%;
  justify-content: space-between;
`;

const FollowDiv = styled.div`
  width: 5rem;
  height: 2rem;
  border-radius: 20px;
  font-family: JejuGothic;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// const ProfileDiv = styled.div`
//   width: 12%;
//   aspect-ratio: 1/1;
//   border-radius: 30px;
//   background-color: var(--c-lightgray);
//   margin-right: 4%;
// `;

// {
//   content: "리뷰",
//   drink: {
//     degree: 0,
//     description: "술 설명",
//     drinkId: 0,
//     image: "술 설명",
//     name: "술 이름",
//     tagId: 0,
//   },
//   drinkReviewId: 0,
//   img: "이미지",
//   user: {
//     userId: 0,
//     email: "이메일",
//     nickname: "닉네임",
//     name: "이름",
//     birth: "생년월일",
//     intro: "한줄",
//     liverPoint: 0,
//     profile: "프로필",
//     follower: 0,
//     following: 0,
//     createdAt: "생성일",
//     updatedAt: "수정일",
//     oauthProvider: "오어스프로바이더",
//     drinkcount: 1,
//   },
//   likeCount: 0,
// }

const UserImg = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  margin-right: 1rem;
`;

const DrinkpostReviewDetail = () => {
  const LikeIcon = likeIcon();
  const CommentIcon = commentIcon();
  const { drinkId, reviewId } = useParams();
  const [review, setReview] = useState<Review>();
  const [drink, setDrink] = useState<Drink>();
  const [following, setFollowing] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    callApi("get", `api/drink/${drinkId}`)
      .then(res => {
        console.log(res.data);
        setDrink(res.data);
      })
      .catch(err => console.error(err));

    async function summonReview() {
      const response1 = await callApi("get", `api/drinkreview/review/${reviewId}`);
      setReview(response1.data);
      const userId = response1.data.user.userId;
      const response2 = await callApi("get", `api/follow/follower/${userId}`);
      if (response2.data.length == 0) {
        setFollowing(0);
        return;
      }
      response2.data.map((item, i) => {
        if (item.follower.userId == parseInt(localStorage.getItem("myId"))) {
          // console.log(following);
          setFollowing(1);
          return;
        } else if (i == response2.data.length - 1) {
          // console.log(following);
          setFollowing(0);
        }
      });
    }
    summonReview();
    // callApi("get", `api/drinkreview/review/${reviewId}`)
    //   .then(res => {
    //     console.log(res.data);
    //     setReview(res.data);
    //     followers();
    //   })

    //   .catch(err => console.error(err));
  }, []);

  const followHandler = async () => {
    const api = await callApi("post", `api/follow/guard/${review?.user.userId}`)
      .then(res => {
        followers();
      })
      .catch(err => console.log(err));
  };

  const followers = async () => {
    callApi("get", `api/follow/follower/${review?.user.userId}`).then(res => {
      if (res.data.length == 0) {
        setFollowing(0);
        return;
      }

      res.data.map((item, i) => {
        if (item.follower.userId == parseInt(localStorage.getItem("myId"))) {
          // console.log(following);
          setFollowing(1);
          return;
        } else if (i == res.data.length - 1) {
          // console.log(following);
          setFollowing(0);
        }
      });
    });
  };

  const toProfileHandler = () => {
    navigate(`/myPage/${review?.user.userId}`);
  };

  // useEffect(() => {
  //   callApi("get", ``);
  // });

  return (
    <>
      <WholeDiv>
        <h2>{drink?.name}</h2>
        <Usercard>
          <div onClick={toProfileHandler} style={{ display: "flex", alignItems: "center" }}>
            <div>
              <UserImg src={review?.user.profile}></UserImg>
            </div>
            {/* <ProfileDiv></ProfileDiv> */}
            <div>
              <b>{review?.user.nickname}</b>
            </div>
          </div>
          <FollowDiv
            style={{ backgroundColor: following === 0 ? "var(--c-yellow)" : "var(--c-lightgray)" }}
            onClick={followHandler}
          >
            {following === 0 ? "팔로우" : "언팔로우"}
          </FollowDiv>
        </Usercard>
        <ImageDiv></ImageDiv>
        <LikeAndComment>
          <div>
            {LikeIcon} {review?.likeCount}
          </div>

          <div>
            {CommentIcon} {review?.drinkReviewId}
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
