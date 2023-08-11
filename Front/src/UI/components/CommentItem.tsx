import styled from "styled-components";
import { forwardRef } from "react";
import { SubReview } from "../../Type/types";
import defaultImg from "../../assets/defaultImg.png";

const WholeDiv = styled.div`
  display: flex;
  margin-top: 1.5rem;
`;

const ProfileDiv = styled.div`
  width: 12%;
  word-break: break-all;
`;

const ProfileDiv2 = styled.div`
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 30px;
  background-size: cover;
`;

const NameAndContent = styled.div`
  margin-left: 8px;
  text-align: start;
  width: 88%;
`;

type CommentItemProps = {
  subReview: SubReview;
};

const commentItem = forwardRef<HTMLDivElement, CommentItemProps>(props => {
  const { subReview } = props;
  return (
    <WholeDiv>
      <ProfileDiv>
        <ProfileDiv2
          style={{
            backgroundImage: `url(${
<<<<<<< Updated upstream
              subReview.user.profile === "no image"
                ? defaultImg
                : subReview.user.profile
=======
              subReview.user?.profile !== "no image" ? subReview.user?.profile : defaultImg
>>>>>>> Stashed changes
            })`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        ></ProfileDiv2>
      </ProfileDiv>
      <NameAndContent>
        <div style={{ fontFamily: "JejuGothic" }}>
          <b>{subReview.user?.nickname}</b>
        </div>
        <div style={{ fontFamily: "NanumSquareNeo", marginTop: "1vh" }}>{subReview.content}</div>
      </NameAndContent>
    </WholeDiv>
  );
});
export default commentItem;
