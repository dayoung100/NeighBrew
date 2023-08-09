import { Review, Drink, SubReview } from "../../Type/types";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { callApi } from "../../utils/api";
import styled from "styled-components";
import { likeIcon, commentIcon, sendIcon } from "./../../assets/AllIcon";
import CommentItem from "./../components/CommentItem";
import plusButton from "../../assets/plusButton.svg";
import NavbarSimple from "../navbar/NavbarSimple";

const LikeAndComment = styled.div`
  display: flex;
  justify-content: space-around;
  width: 36%;
  margin-top: 1.5vh;
  font-size: 20px;
`;

const Description = styled.div`
  text-align: start;
  margin-top: 1rem;
  white-space: pre-wrap;
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

const WholeDiv = styled.div`
  margin: 24px;
`;

const ImageDiv = styled.div`
  background-color: var(--c-lightgray);
  background-repeat: no-repeat;
  background-size: cover;
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

const UserImg = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  margin-right: 1rem;
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

const SubReviewCreateDiv = styled.div`
  background-color: var(--c-lightgray);
  border-radius: 20px;
  text-align: start;
  height: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RoundBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 10%;

  background: var(--c-yellow);
  width: 4rem;
  height: 4rem;
  border-radius: 100px;
  z-index: 10;

  @media (max-width: 430px) {
    right: 5%;
  }
  @media (min-width: 431px) {
    left: 350px;
  }
`;

const SubReviewInput = styled.input`
  border: none;
  width: 80%;
  /* border-bottom: 1px solid var(--c-black); */
  background-color: var(--c-lightgray);
  font-size: 1.2rem;
  outline: none;
  &:focus {
    border: none;
    /* border-bottom: 2px solid black; */
  }
`;

const DrinkpostReviewDetail = () => {
  const LikeIcon = likeIcon();
  const CommentIcon = commentIcon();
  const SendIcon = sendIcon();
  const { drinkId, reviewId } = useParams();
  const [review, setReview] = useState<Review>();
  const [drink, setDrink] = useState<Drink>();
  const [following, setFollowing] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const [isSubReview, setIsSubReview] = useState(false);
  const [subReviewList, setSubReviewList] = useState<SubReview[]>([]);
  const [comment, setComment] = useState("");
  const [postable, setPostable] = useState(false);
  const toggleShowMore = () => {
    setShowMore(!showMore);
  };
  const navigate = useNavigate();

  useEffect(() => {
    callApi("get", `api/drink/${drinkId}`)
      .then((res) => {
        console.log(res.data);
        setDrink(res.data);
      })
      .catch((err) => console.error(err));

    callApi("get", `api/subreview/list/${reviewId}`)
      .then(res => {
        console.log(res.data);
        setSubReviewList(prev => [...prev, ...res.data]);
      })
      .catch(err => console.error(err));

    async function summonReview() {
      const response1 = await callApi(
        "get",
        `api/drinkreview/review/${reviewId}`
      );
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
      .then((res) => {
        followers();
      })
      .catch((err) => console.log(err));
  };

  const followers = async () => {
    callApi("get", `api/follow/follower/${review?.user.userId}`).then((res) => {
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

  const commentHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
    setPostable(e.target.value.trim() !== "");
  };

  const submitHandler = () => {
    if (postable === false) {
      return;
    }
    setComment("");
    callApi("post", "api/subreview/guard/write", {
      content: comment.trim(),
      drinkReviewId: reviewId,
    })
      .then(res => {
        console.log(res.data);
        setSubReviewList(prev => [...prev, res.data]);
      })
      .catch(err => console.error(err));
  };
  // useEffect(() => {
  //   callApi("get", ``);
  // });

  return (
    <>
      <WholeDiv>
        <NavbarSimple title={drink?.name}></NavbarSimple>
        <Usercard>
          <div
            onClick={toProfileHandler}
            style={{ display: "flex", alignItems: "center" }}
          >
            <div>
              <UserImg src={review?.user.profile}></UserImg>
            </div>
            <div>
              <b>{review?.user.nickname}</b>
            </div>
          </div>
          <FollowDiv
            style={{
              backgroundColor:
                following === 0 ? "var(--c-yellow)" : "var(--c-lightgray)",
            }}
            onClick={followHandler}
          >
            {following === 0 ? "팔로우" : "언팔로우"}
          </FollowDiv>
        </Usercard>
        <ImageDiv style={{ backgroundImage: `url(${review?.img})` }}></ImageDiv>
        <LikeAndComment>
          <div>
            {LikeIcon} {review?.likeCount}
          </div>

          <div onClick={() => setIsSubReview(!isSubReview)}>
            {CommentIcon} {subReviewList.length}
          </div>
        </LikeAndComment>
        <Description className={showMore ? "show" : ""}>
          {review?.content}
        </Description>
        {review?.content.split("\n").length > 4 && (
          <MoreButton
            onClick={toggleShowMore}
            className={showMore ? "hide" : ""}
            style={{ textAlign: "start" }}
          >
            ...더보기
          </MoreButton>
        )}
        <hr />
        {isSubReview && (
          <SubReviewCreateDiv>
            <SubReviewInput
              id="subreview"
              placeholder="댓글을 남겨주세요."
              onChange={commentHandler}
              value={comment}
            ></SubReviewInput>
            <div
              onClick={submitHandler}
              style={{ height: "100%", display: "flex", alignItems: "center" }}
            >
              <p style={{ color: postable ? "#329BD6" : "#000000" }}>Post</p>
            </div>
          </SubReviewCreateDiv>
        )}
        <div className="subReviewList">
          {subReviewList.map((subReview, i) => {
            return <CommentItem key={i} subReview={subReview}></CommentItem>;
          })}
        </div>
        <RoundBtn onClick={() => setIsSubReview(!isSubReview)}>
          <img src={plusButton} width="25rem" />
        </RoundBtn>
      </WholeDiv>
    </>
  );
};
export default DrinkpostReviewDetail;
