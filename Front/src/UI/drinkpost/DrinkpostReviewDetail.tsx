import {useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import styled from "styled-components";
import {Drink, Review, SubReview} from "../../Type/types";
import defaultImg from "../../assets/defaultImg.png";
import {callApi} from "../../utils/api";
import {commentIcon, likeIcon} from "./../../assets/AllIcon";
import sendImage from "./../../assets/send.png";
import CommentItem from "./../components/CommentItem";
// import TextareaAutosize from 'react-textarea-autosize';
//
// const StyleAutoTextArea = styled(TextareaAutosize)`
//   display: flex;
//   border: 0.5px solid #D2D2D2;
//   background-color: #d2d2d2;
//   border-radius: 5px;
//
//   // 글을 아래에 배치
//   align-self: flex-end;
//   font-size: 1rem;
//   &:focus {
//     border: none;
//   }
// `
// ;

const LikeAndComment = styled.div`
  display: flex;
  justify-content: left;
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

const SubReviewCreateDiv = styled.div`
  background-color: var(--c-lightgray);
  border-radius: 20px;
  text-align: start;
  height: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SubReviewInput = styled.input`
  border: none;
  width: 80%;
  background-color: var(--c-lightgray);
  font-size: 1.2rem;
  outline: none;

  &:focus {
    border: none;
  }
`;
const CommentBox = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background-color: #fff;
  margin-top: 2rem;
  display: grid;
  grid-template-columns: 0.8fr 0.2fr;
  padding: 2px 24px;
  padding-top: 0px;
  height: 60px;
  width: 100%;
`;

const CommentInput = styled.input`
  display: flex;
  margin-right: 10px;
  border: none;
  border-bottom: 1px solid var(--c-gray);
  border-radius: 5px;
  height: 90%;
  // 글을 아래에 배치
  align-self: flex-end;
  font-size: 1rem;

  &:focus {
    border: none;
  }

  background-color: #d2d2d2;
`;

const CommentButton = styled.button`
  background-color: var(--c-blue);
  border: none;
  border-radius: 5px;
`;

const SendImg = styled.img`
  width: 18px;
  height: 18px;
  margin-left: 8px;
`;

const SubReviewList = styled.div`
  padding-bottom: 4.5rem;
`;

const LikeAndCommentDiv = styled.div`
  display: flex;
  flex-direction: row;
`;


const DrinkpostReviewDetail = () => {
    const LikeIcon = likeIcon();
    const CommentIcon = commentIcon();
    const {drinkId, reviewId} = useParams();
    const [review, setReview] = useState<Review>();
    const [drink, setDrink] = useState<Drink>();
    const [following, setFollowing] = useState(0);
    const [subReviewList, setSubReviewList] = useState<SubReview[]>([]);
    const [comment, setComment] = useState("");
    const [postable, setPostable] = useState(false);
    const navigate = useNavigate();

    const endOfCommentsRef = useRef(null);

    useEffect(() => {
        callApi("get", `api/drink/${drinkId}`)
            .then((res) => {
                setDrink(res.data);
            })
            .catch((err) => console.error(err));

        callApi("get", `api/subreview/list/${reviewId}`)
            .then((res) => {
                setSubReviewList((prev) => [...prev, ...res.data]);
            })
            .catch((err) => console.error(err));

        async function summonReview() {
            // 술 상세 후기 조회 요청
            const response1 = await callApi(
                "get",
                `api/drinkreview/review/${reviewId}`
            );
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
            .then((res) => {
                followers();
            })
            .catch((err) => {
            });
    };

    const followers = async () => {
        callApi("get", `api/follow/follower/${review?.user.userId}`).then((res) => {
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

    const commentHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setComment(e.target.value);
        setPostable(e.target.value.trim() !== "");
    };

    // 술 후기에 대한 댓글 제출하는 함수.
    const submitHandler = async () => {
        if (postable === false) {
            return;
        }
        const fun = await callApi("post", "api/subreview/guard/write", {
            content: comment.trim(),
            drinkReviewId: reviewId,
        });

        setComment("");
        setSubReviewList((prev) => [...prev, fun.data]);

        endOfCommentsRef.current?.scrollIntoView({behavior: "smooth"});
    };
    return (
        <>
            <WholeDiv>
                <h2>{drink?.name}</h2>
                <Usercard>
                    <div
                        onClick={toProfileHandler}
                        style={{display: "flex", alignItems: "center"}}
                    >
                        <div>
                            <UserImg
                                src={
                                    review?.user.profile !== "no image"
                                        ? review?.user.profile
                                        : defaultImg
                                }
                            ></UserImg>
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
                <ImageDiv style={{backgroundImage: `url(${review?.img})`}}></ImageDiv>
                <LikeAndComment>
                    <LikeAndCommentDiv>
                        <div>
                            {LikeIcon}
                        </div>
                        <div>
                      {/*<div style="margin: 0 1vh; ">*/}
                        {review?.likeCount}
                        </div>
                    </LikeAndCommentDiv>
                    <LikeAndCommentDiv>
                        <div>
                            {CommentIcon}
                        </div>
                        {/*<div style="margin: 0 1vh; "> */}
                        <div>
                            {subReviewList.length}
                        </div>
                    </LikeAndCommentDiv>
                </LikeAndComment>
                <Description>{review?.content}</Description>
                <hr/>
                <CommentBox>
                    <CommentInput
                      placeholder="댓글을 작성해주세요..."
                      value={comment}
                      onChange={commentHandler}
                    />
                    {/*<StyleAutoTextArea*/}
                    {/*    minRows={1}*/}
                    {/*    maxRows={5}*/}
                    {/*    placeholder="댓글을 작성해주세요..."*/}
                    {/*    value={comment}*/}
                    {/*    onChange={commentHandler}*/}
                    {/*/>*/}
                    <CommentButton onClick={submitHandler}>
                        <SendImg src={sendImage} alt=""/>
                    </CommentButton>
                </CommentBox>
                <SubReviewList>
                    {subReviewList.map((subReview, i, array) => {
                        // 마지막 댓글에만 ref를 붙임
                        if (i === array.length - 1) {
                            return (
                                <CommentItem
                                    ref={endOfCommentsRef}
                                    key={i}
                                    subReview={subReview}
                                ></CommentItem>
                            );
                        } else {
                            return <CommentItem key={i} subReview={subReview}></CommentItem>;
                        }
                    })}
                </SubReviewList>
            </WholeDiv>
        </>
    );
};
export default DrinkpostReviewDetail;
