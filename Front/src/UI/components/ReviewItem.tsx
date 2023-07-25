import styled from "styled-components";
import likeIcon from "../../assets/likeIcon.svg";
import { useState, useRef } from "react";

const ReviewCard = styled.div`
  background-color: white;
  display: flex;
  justify-content: start;
  margin: 30px;
`;

const ReviewImg = styled.div`
  background-color: var(--c-gray);
  border-radius: 12px;
  width: 90px;
  height: 90px;
`;

const UserCard = styled.div`
  background-color: white;
  text-align: start;
  display: flex;
  justify-content: space-between;
`;

const MoreButton = styled.button`
  background-color: white;
  border: none;
`;

type ReviewItemProps = {
  userId: number;
  image: string;
  description: string;
};

const ReviewItem = (props: ReviewItemProps) => {
  const [limit, setLimit] = useState(62);
  const toggleEllipsis = (str: string, limit: number) => {
    return {
      string: str.slice(0, limit),
      isShowMore: str.length > limit,
    };
  };

  const onClickMore = (str: string) => () => {
    setLimit(str.length);
  };
  return (
    <>
      <ReviewCard>
        <ReviewImg>
          <img src="#" alt={props.image} />
        </ReviewImg>
        <div>
          <UserCard>
            <div>
              <span>
                <img src="#" alt="profile" />
              </span>
              <span>{props.userId}</span>
            </div>
            <div>
              <img src={likeIcon} alt="like" />
              <span>38</span>
            </div>
          </UserCard>
          <div style={{ marginLeft: "10px" }}>
            <p style={{ textAlign: "start" }}>
              {toggleEllipsis(props.description, limit).string}
              {toggleEllipsis(props.description, limit).isShowMore && (
                <MoreButton onClick={onClickMore(props.description)}>...더보기</MoreButton>
              )}
            </p>
          </div>
        </div>
      </ReviewCard>
    </>
  );
};
export default ReviewItem;
