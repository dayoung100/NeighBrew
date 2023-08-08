import { styled } from "styled-components";
import RatingMember from "./RatingMember";
import { callApi } from "../../utils/api";
import { useEffect, useState } from "react";
import { MeetDetail, User } from "../../Type/types";

const PageName = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Title = styled.div`
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const MemberContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

// 가운데 정렬
const MemberInfo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

// 등록버튼
const RatingButton = styled.button`
  width: 65%;
  padding-top: 16px;
  padding-bottom: 16px;
  border-radius: 40px;
  border: none;
  background-color: var(--c-yellow);
  color: black;
  font-size: 1.25rem;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  margin-top: 3.125rem;
`;

const PostHandler = () => {
  callApi("GET", "/api/meet/7")
    .then((res) => {
      console.log(res);
    })
    .catch((e) => {
      console.log(e);
    });
};

const RatingCreate = () => {
  const [meetingDetail, setMeetingDetail] = useState<MeetDetail>();
  const [users, setUsers] = useState<User[]>();

  useEffect(() => {
    callApi("GET", "/api/meet/7")
      .then((res) => {
        console.log(res);
        setMeetingDetail(res.data);
        setUsers(res.data.users);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <div>
      <PageName>평가하기</PageName>
      <Title>회원 평가</Title>
      <MemberContainer>
        <MemberInfo>회원 정보</MemberInfo>
        {users?.map((user: User) => (
          <RatingMember _user={user}></RatingMember>
        ))}
      </MemberContainer>
      <RatingButton
        onClick={() => {
          PostHandler();
        }}
      >
        등록하기
      </RatingButton>
    </div>
  );
};

export default RatingCreate;
