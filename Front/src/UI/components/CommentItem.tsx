import styled from "styled-components";
import { SubReview, User } from "../../Type/types";
import { useState, useEffect } from "react";
import { callApi } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const WholeDiv = styled.div`
  display: flex;
  margin-top: 1vh;
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

const commentItem = ({ subReview }: { subReview: SubReview }) => {
  const [user, setUser] = useState<User>();
  const navigate = useNavigate();
  const toProfileHandler = () => {
    navigate;
  };
  useEffect(() => {
    callApi("get", `api/user/${subReview.userId}`)
      .then(res => {
        setUser(res.data);
      })
      .catch(err => console.error(err));
  }, []);
  return (
    <>
      <WholeDiv>
        <ProfileDiv>
          <ProfileDiv2></ProfileDiv2>
        </ProfileDiv>
        <NameAndContent>
          <div>
            <b>{user?.nickname}</b>
          </div>
          <div>{subReview.content}</div>
        </NameAndContent>
      </WholeDiv>
    </>
  );
};
export default commentItem;
