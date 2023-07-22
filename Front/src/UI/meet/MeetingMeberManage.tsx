import { useState } from "react";
import styled from "styled-components";
import NavbarSimple from "../navbar/NavbarSimple";
import PeopleNumInfo from "./PeopleNumInfo";
import Footer from "../footer/Footer";
import UserInfoItem from "../components/UserInfoItem";

const SubTitle = styled.div`
  font-size: 20px;
  margin: 2rem 1rem 0.5rem 1rem;
`;

const BtnSmall = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  width: 2rem;
  height: 2rem;
  border-radius: 5px;
  margin: 0 0.2rem;
`;

const OKBtn = styled(BtnSmall)`
  background: var(--c-yellow);
`;

const NoBtn = styled(BtnSmall)`
  background: #f28f79;
`;

const MeetingMemberManage = () => {
  const [memberList, setMemberList] = useState(["주최자 이름", "참여자1", "참여자2", "참여자3"]);
  const [applicantList, setApplicantList] = useState(["신청자1", "신청자2", "신청자3"]);

  const acceptHandler = (userName: string) => {
    console.log("you accepted user : ", userName);
  };
  const refuseHandler = (userName: string) => {
    console.log("you refused user : ", userName);
  };

  return (
    <div style={{ fontFamily: "JejuGothic" }}>
      <header>
        <NavbarSimple title="모임 관리" />
      </header>
      <div style={{ fontSize: "32px", marginTop: "1rem" }}>모임의 제목이 들어갑니다</div>
      <SubTitle style={{ display: "flex", alignItems: "center" }}>
        <div>참여중</div>
        <PeopleNumInfo now={1} max={4} color="var(--c-black)" size={15} />
      </SubTitle>
      <div style={{ margin: "0 1rem" }}>
        {memberList.map((member, index) => {
          return (
            <UserInfoItem
              userId={1}
              name={member}
              intro="한 마디는 이렇게 저렇게 작성하기 한 마디는 이렇게 저렇게 작성하기"
              imgSrc="/src/assets/tempgif.gif"
              isMaster={index === 0}
              width={15}
            />
          );
        })}
      </div>
      <SubTitle style={{ textAlign: "left" }}>참여 신청</SubTitle>
      <div style={{ margin: "0 1rem" }}>
        {applicantList.map((applicant, index) => {
          return (
            <div style={{ display: "flex", alignItems: "center" }}>
              <UserInfoItem
                userId={1}
                name={applicant}
                intro="한 마디는 이렇게 저렇게 작성하기 한 마디는 이렇게 저렇게 작성하기"
                imgSrc="/src/assets/tempgif.gif"
                isMaster={false}
                width={13}
              />
              <OKBtn onClick={() => acceptHandler(applicant)}>
                <img src="/src/assets/checkButtonIcon.svg" />
              </OKBtn>
              <NoBtn onClick={() => refuseHandler(applicant)}>
                <img src="/src/assets/XButtonIcon.svg" />
              </NoBtn>
            </div>
          );
        })}
      </div>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};
export default MeetingMemberManage;
