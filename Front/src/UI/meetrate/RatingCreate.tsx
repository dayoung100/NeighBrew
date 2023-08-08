import { styled } from "styled-components";
import RatingMember from "./RatingMember";
import { callApi } from "../../utils/api";
import { useEffect, useState } from "react";
import { Evaluation, MeetDetail, User } from "../../Type/types";

const PageName = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Title = styled.div`
  font-size: 27px;
  font-weight: bold;
  margin-bottom: 20px;
  margin-top: 25px;
`;

const MemberContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-top: 32px;
`;

// 가운데 정렬
const MemberInfo = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  font-size: 24px;
  font-weight: bold;
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
  font-size: 20px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  margin-top: 50px;
`;

const PostHandler = () => {
  callApi("POST", "/api/evaluation/guard").then((res) => {
    console.log(res);
  });
};

const RatingCreate = () => {
  const [meetingDetail, setMeetingDetail] = useState<MeetDetail>();
  const [users, setUsers] = useState<User[]>();
  const [evaluation, setEvaluation] = useState<Evaluation[]>();
  const [selectedButtons, setSelectedButtons] = useState({}); // 사용자별로 선택된 버튼 값을 저장
  const userId = parseInt(localStorage.getItem("myId"));
  const evaluationType = {
    1: "GOOD",
    2: "MID",
    3: "BAD",
  };


  const handleSelectedButton = (userId: number, buttonNumber: number) => {
    // 사용자 ID와 선택된 버튼 번호를 인자로 받음
    setSelectedButtons({
      ...selectedButtons,
      [userId]: buttonNumber, // 해당 사용자의 선택된 버튼 값을 저장
    });
  };

  useEffect(() => {
    callApi("GET", "/api/meet/7")
      .then((res) => {
        setMeetingDetail(res.data);
        return res.data.users.filter((user: User) => user.userId !== userId);
      })
      .then((users) => {
        setUsers(users);
      })
      .catch((e) => {});
  }, []);

  // 각 사용자의 선택된 버튼 값을 저장하는 함수
  return (
    <div
      style={{
        paddingTop: "50px",
        paddingBottom: "50px",
        paddingLeft: "30px",
        paddingRight: "30px",
      }}
    >
      <PageName>이번 모임은 어떠셨나요?</PageName>
      <Title>모임의 제목이 들어갑니다</Title>
      <MemberContainer>
        <MemberInfo>모임 참여 멤버 {users?.length}</MemberInfo>
        {users?.map((user: User) => (
          <RatingMember
            key={user.userId}
            _user={user}
            onSelectButton={(buttonNumber) =>
              handleSelectedButton(user.userId, buttonNumber)
            }
          />
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
