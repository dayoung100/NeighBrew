import { styled } from "styled-components";
import { MeetDetail } from "../../Type/types";
import { useEffect, useState } from "react";
import RatingDetail from "./RatingDetail";
import defaultImg from "../../assets/defaultImg.png";

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
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 2px;
`;

// 흐린 글씨
const MemberDescription = styled.div`
  font-size: 14px;
  color: #828282;
`;

// 라디오 버튼 컨테이너
const RadioContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  /* margin-top: 20px; */
  margin-bottom: 10px;
`;

// 라디오 버튼
// 눌리면 색깔 바뀌게 하기
const RadioButton = styled.button<{ selected: boolean }>`
  height: 35px;
  width: 30%;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  /* border: 1px solid black; */
  /* isSelect에 따라 border 제거 */
  border: ${({ selected }) => (selected ? "none" : ".5008px solid black")};
  background-color: ${({ selected }) =>
    selected ? "var(--c-yellow)" : "white"};
  color: ${({ selected }) => (selected ? "white" : "black")};
`;

const RatingMember = ({ _user, onSelectButton }) => {
  const [meetingDetail, setMeetingDetail] = useState<MeetDetail>();
  const [selectedButton, setSelectButton] = useState(0);
  const [selectedDesc, setSelectedDesc] = useState("");

  useEffect(() => {
    onSelectButton(selectedButton, selectedDesc); //부모로 전달
  }, [selectedButton, selectedDesc]);

  return (
    // div width: 100%로 해서 가운데 정렬
    <div
      style={{
        width: "100%",
        margin: "0 auto 1rem auto",
      }}
    >
      <MemberProfile>
        <MemberImg
          src={_user.profile === "no image" ? defaultImg : _user.profile}
        />
        <MemberText>
          <MemberName>{_user.nickname}</MemberName>
          <MemberDescription>{_user.intro}</MemberDescription>
        </MemberText>
      </MemberProfile>

      <RadioContainer>
        <RadioButton
          selected={selectedButton === 1}
          onClick={() => setSelectButton(1)}
        >
          좋아요
        </RadioButton>
        <RadioButton
          selected={selectedButton === 2}
          onClick={() => setSelectButton(2)}
        >
          보통이에요
        </RadioButton>

        <RadioButton
          selected={selectedButton === 3}
          onClick={() => setSelectButton(3)}
        >
          아쉬워요
        </RadioButton>
      </RadioContainer>
      <RatingDetail
        ratingNum={selectedButton}
        getFunc={(desc) => setSelectedDesc(desc)}
      />
    </div>
  );
};

export default RatingMember;
