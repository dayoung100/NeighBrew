import { styled } from "styled-components";
import { MeetDetail } from "../../Type/types";
import { useEffect, useState } from "react";
import { callApi } from "../../utils/api";

const MemberProfile = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-top: 20px;
  margin-bottom: 15px;
`;

// 동그란 프로필 사진
const MemberImg = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const MemberText = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  align-items: flex-start;
`;

const MemberName = styled.div`
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 0.125rem;
`;

// 흐린 글씨
const MemberDescription = styled.div`
  font-size: 0.875rem;
  color: #828282;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

// 납짝한 버튼
const RaatingButton = styled.button`
  width: 7.5rem;
  height: 100%;
  border-radius: 2.5rem;
  border: 0.0063rem solid black;
  background-color: white;
  color: black;
  font-size: 14px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.4375rem;
`;

const RatingMember = ({ _user }) => {
  const [meetingDetail, setMeetingDetail] = useState<MeetDetail>();

  useEffect(() => {
    callApi("GET", "/api/meet/7")
      .then((res) => {
        setMeetingDetail(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    // div width: 100%로 해서 가운데 정렬
    <div
      style={{
        width: "90%",
        margin: "0 auto",
      }}
    >
      <MemberProfile>
        <MemberImg src={_user.profile} />
        <MemberText>
          <MemberName>{_user.nickname}</MemberName>
          <MemberDescription>{_user.intro}</MemberDescription>
        </MemberText>
      </MemberProfile>
      <ButtonContainer>
        <RaatingButton>좋아요</RaatingButton>
        <RaatingButton>보통</RaatingButton>
        <RaatingButton>아쉬워요</RaatingButton>
      </ButtonContainer>
    </div>
  );
};

export default RatingMember;
