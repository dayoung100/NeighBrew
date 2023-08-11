import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import styled from "styled-components";
import { Drink, Review, SubReview } from "../../Type/types";
import defaultImg from "../../assets/defaultImg.png";
import fancyDrinkImage from "../../assets/fancydrinkImage.jpg";
import { callApi } from "../../utils/api";
import { commentIcon, likeIcon } from "./../../assets/AllIcon";
import sendImage from "./../../assets/send.png";
import CommentItem from "./../components/CommentItem";
import TextareaAutosize from "react-textarea-autosize";

const StyleAutoTextArea = styled(TextareaAutosize)`
  display: flex;
  flex-basis: 90%;
  border: 0.5px solid #dfdfdf;
  background-color: #eeeeee;
  border-radius: 5px;
  margin: 0.5rem 0 0.5rem 0.5rem;
  padding: 0.3rem;
  overflow-y: auto;

  // 글을 아래에 배치
  align-self: flex-end;
  font-size: 1rem;

  &:focus {
    border: none;
  }
`;
const LikeAndComment = styled.div`
  margin: 0.5rem;
  display: flex;
  justify-content: left;
  width: 36%;
  margin-top: 1.5vh;
  font-size: 20px;
`;

const Description = styled.div`
  text-align: start;
  margin: 0.5rem;
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

const WholeDiv = styled.div``;

const ImageDiv = styled.div`
  background-color: var(--c-lightgray);
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 36vh;
`;

const Usercard = styled.div`
  display: flex;
  align-items: center;
  margin: 0.5rem;
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

const CommentBox = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background-color: #fff;
  display: flex;
  flex-direction: row;
  width: 100%;
  border-top: 0.5px solid #dfdfdf;
`;

const CommentButton = styled.button`
  background-color: var(--c-blue);
  border: none;
  border-radius: 5px;
  flex-basis: 10%;
`;

const SendImg = styled.img`
  width: 23px;
  height: 23px;
`;

const SubReviewList = styled.div`
  padding-bottom: 4.5rem;
  margin: 0.5rem;
`;

const LikeAndCommentDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

const DrinkpostReviewDetail = () => {
  const LikeIcon = likeIcon();
  const CommentIcon = commentIcon();
  const { drinkId, reviewId } = useParams();
  const [review, setReview] = useState<Review>();
  const [drink, setDrink] = useState<Drink>();
  const [following, setFollowing] = useState(0);
  const [subReviewList, setSubReviewList] = useState<SubReview[]>([]);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    callApi("get", `api/drink/${drinkId}`)
      .then(res => {
        setDrink(res.data);
      })
      .catch(err => console.error(err));

    callApi("get", `api/subreview/list/${reviewId}`)
      .then((res) => {
        setSubReviewList(res.data);
      })
      .catch((err) => console.error(err));

    async function summonReview() {
      // 술 상세 후기 조회 요청
      const response1 = await callApi("get", `api/drinkreview/review/${reviewId}`);
      setReview(response1.data);
      const userId = response1.data.user.userId;
      // 후기 쓴 사람에 대한 follow 요청
      // 술 상세 후기 조회 이후에 이루어져야 함.
      const response2 = await callApi("get", `api/follow/follower/${userId}`);
      if (response2.data.length == 0) {
        setFollowing(0);
        return;
      }
      response2.data.map((item, i) => {
        if (item.follower.userId == parseInt(localStorage.getItem("myId"))) {
          setFollowing(1);
          return;
        } else if (i == response2.data.length - 1) {
          setFollowing(0);
        }
      });
    }
    summonReview();
  }, []);

  const followHandler = () => {
    callApi("post", `api/follow/guard/${review?.user.userId}`)
      .then(res => {
        followers();
      })
      .catch(err => {});
  };

  const followers = async () => {
    callApi("get", `api/follow/follower/${review?.user.userId}`).then(res => {
      if (res.data.length == 0) {
        setFollowing(0);
        return;
      }

      res.data.map((item, i) => {
        if (item.follower.userId == parseInt(localStorage.getItem("myId"))) {
          setFollowing(1);
          return;
        } else if (i == res.data.length - 1) {
          setFollowing(0);
        }
      });
    });
  };

  const toProfileHandler = () => {
    navigate(`/myPage/${review?.user.userId}`);
  };

  const commentHandler = (e: React.ChangeEvent<HTMLInputElement>) => {};

  useEffect(() => {}, [comment]);

  // 술 후기에 대한 댓글 제출하는 함수.
  const submitHandler = async () => {
    const fun = await callApi("post", "api/subreview/guard/write", {
      content: comment.trim(),
      drinkReviewId: reviewId,
    });

    setComment("");
    setSubReviewList((prev) => [fun.data, ...prev]);
  };
  return (
    <>
      <WholeDiv>
        <h2>{drink?.name}</h2>
        <Usercard>
          <div onClick={toProfileHandler} style={{ display: "flex", alignItems: "center" }}>
            <div>
              <UserImg
                src={review?.user.profile !== "no image" ? review?.user.profile : defaultImg}
              ></UserImg>
            </div>
            <div>
              <b>{review?.user.nickname}</b>
            </div>
          </div>
          <FollowDiv
            style={{
              backgroundColor: following === 0 ? "var(--c-yellow)" : "var(--c-lightgray)",
            }}
            onClick={followHandler}
          >
            {following === 0 ? "팔로우" : "언팔로우"}
          </FollowDiv>
        </Usercard>
        <ImageDiv
          style={{
            backgroundImage: `url(${review?.img !== "no image" ? review?.img : fancyDrinkImage})`,
          }}
        ></ImageDiv>
        <LikeAndComment>
          <LikeAndCommentDiv>
            <div>{LikeIcon}</div>
            <div>{review?.likeCount}</div>
          </LikeAndCommentDiv>
          <LikeAndCommentDiv>
            <div>{CommentIcon}</div>
            <div>{subReviewList.length}</div>
          </LikeAndCommentDiv>
        </LikeAndComment>
        <Description>{review?.content}</Description>

        <CommentBox>
          <StyleAutoTextArea
            placeholder="댓글을 작성해주세요..."
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
            }}
            minRows={1}
            maxRows={4}
          />
          <CommentButton
            onClick={() => {
              submitHandler();
            }}
          >
            <SendImg src={sendImage} alt="" />
          </CommentButton>
        </CommentBox>
        <SubReviewList>
          {subReviewList.map((subReview, i) => {
            return <CommentItem key={i} subReview={subReview}></CommentItem>;
          })}
        </SubReviewList>
      </WholeDiv>
    </>
  );
};
export default DrinkpostReviewDetail;
