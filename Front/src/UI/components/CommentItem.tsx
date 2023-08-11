import styled from "styled-components";
import { forwardRef } from "react";
import { SubReview } from "../../Type/types";

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
  background-color: var(--c-lightgray);
`;

const NameAndContent = styled.div`
  margin-left: 8px;
  text-align: start;
  width: 88%;
`;

type CommentItemProps = {
  subReview: SubReview;
};

const commentItem = forwardRef<HTMLDivElement, CommentItemProps>((props) => {
  const { subReview } = props;
  return (
    <WholeDiv>
      <ProfileDiv>
        <ProfileDiv2
          style={{
            backgroundImage: `url(${
              subReview.user?.profile || "기본 이미지 URL"
            })`,
          }}
        ></ProfileDiv2>
      </ProfileDiv>
      <NameAndContent>
        <div>
          <b>{subReview.user?.nickname}</b>
        </div>
        <div>{subReview.content}</div>
      </NameAndContent>
    </WholeDiv>
  );
});
export default commentItem;
