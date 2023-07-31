/*
[MeetingDetail.tsx]
특정한 모임의 상세 정보를 보여주는 페이지
모임 리스트에서 하나를 클릭하면 이 페이지로 이동함
모임 위치, 시간, 주최자, 간수치제한, 인원 제한 정보를 담고 있음
*/
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { arrowLeftIcon } from "../../assets/AllIcon";
import styled from "styled-components";
import PeopleNumInfo from "./PeopleNumInfo";
import ListInfoItem from "../components/ListInfoItem";
import UserInfoItem from "../components/UserInfoItem";
import FooterBigBtn from "../footer/FooterBigBtn";
import backgroundImg from "../../assets/ForTest/backgroundImg.jpg";
import { callApi } from "../../utils/api";
import { Meeting, User } from "../../Type/types";

const MeetThumbnail = styled.div`
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url(${backgroundImg}) no-repeat center;
  background-size: cover;
  width: 100%;
  height: 30vh;
  color: white;
`;

const Tag = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--c-yellow);
  padding: 1.5% 2%;
  font-family: "SeoulNamsan";
  font-size: 7px;
  border-radius: 10px;
  color: var(--c-black);
  &::before {
    content: "";
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: white;
    margin-right: 2px;
  }
  span {
    display: flex;
    justify-content: center;
    min-width: 30px;
  }
`;

const MeetDetailDiv = styled.div`
  background: var(--c-lightgray);
  min-height: 70vh;
  border-radius: 30px 30px 0px 0px;
  position: relative;
  z-index: 1;
  top: -2rem;
  padding: 4.5rem 1rem;
`;

const MeetPosDateDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: absolute;
  top: 12rem;
  left: 50%;
  transform: translate(-50%, 0%);
  z-index: 2;
  width: 17rem;
  height: 4rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.07);
  padding: 1rem;
  font-family: "SeoulNamsan";
  font-size: 16px;
`;

const MeetTitle = styled.div`
  font-family: "JejuGothic";
  font-size: 20px;
  text-align: left;
  margin-top: 1.5rem;
`;

type MeetDetail = {
  meetDto: Meeting;
  users: User[];
  statuses: [];
};

const MeetingDetail = () => {
  const ArrowLeftIcon = arrowLeftIcon("white");
  const { meetId } = useParams(); //meetId는 라우터 링크에서 따오기
  const [meetDetailData, setMeetDetailData] = useState<MeetDetail>(); //모임 데이터
  const [memberList, setMemberList] = useState<User[]>([]); //참여자 리스트

  //네비게이터 : 모임 관리 페이지로 이동, 뒤로가기 기능
  const navigate = useNavigate();
  const GoBackHandler = () => {
    navigate(-1);
  };
  const GotoMeetManageHandler = (meetId: number) => {
    console.log("goto manage page, meetId is: ", meetId);
    navigate(`/meet/${meetId}/manage`);
  };

  //api 호출
  useEffect(() => {
    const promise = callApi("get", `api/meet/${meetId}`);
    promise.then((res) => {
      console.dir(res.data);
      setMeetDetailData(res.data); //받아온 데이터로 meetDetailData 세팅
    });
  }, [meetId]);

  //users에서 apply인 유저 제외하고 memberList에 넣기
  useEffect(() => {
    if (meetDetailData !== undefined) {
      let members = meetDetailData.users.filter(
        (user, index) => meetDetailData.statuses[index] !== "APPLY"
      );
      setMemberList(members);
    }
  }, [meetDetailData]);

  //태그ID를 태그 이름으로 변환
  //TODO: 공용 변수로 빼기??
  function getTagName(tagId: number) {
    const tag = [
      { tagId: 0, tagName: "전체" },
      { tagId: 1, tagName: "양주" },
      { tagId: 2, tagName: "전통주" },
      { tagId: 3, tagName: "전체" },
      { tagId: 4, tagName: "사케" },
      { tagId: 5, tagName: "와인" },
      { tagId: 6, tagName: "수제맥주" },
      { tagId: 7, tagName: "소주/맥주" },
    ];
    return tag[tagId].tagName;
  }
  function hasAgeLimit() {
    if (meetDetailData === undefined) return false;
    const res =
      (meetDetailData.meetDto.minAge ?? 0) > 0 ||
      (meetDetailData.meetDto.maxAge ?? 0) > 0
        ? true
        : false;
    return res;
  }

  return (
    <div style={{ color: "var(--c-black)" }}>
      <MeetThumbnail>
        <div
          style={{
            display: "flex",
            textAlign: "left",
            padding: "1rem",
          }}
        >
          <div
            style={{ cursor: "pointer", marginRight: "1rem" }}
            onClick={GoBackHandler}
          >
            {ArrowLeftIcon}
          </div>
          <Tag>{getTagName(meetDetailData.meetDto.tagId)}</Tag>
        </div>
        <div style={{ textAlign: "center", padding: "2rem 0 7rem 0" }}>
          <div
            style={{
              fontFamily: "JejuGothic",
              fontSize: "32px",
              marginBottom: "0.5rem",
            }}
          >
            {meetDetailData.meetDto.meetName}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "SeoulNamsan",
              fontSize: "15px",
            }}
          >
            <div>주최자: </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src="../src/assets/tempgif.gif"
                width="20rem"
                style={{ borderRadius: "100px" }}
              />
              <div>{memberList[0].name}</div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <PeopleNumInfo
              now={meetDetailData.meetDto.nowParticipants}
              max={meetDetailData.meetDto.maxParticipants}
              color="white"
              size={11}
            />
          </div>
        </div>
      </MeetThumbnail>
      <MeetDetailDiv>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            fontSize: "13px",
            fontFamily: "Noto Sans KR",
          }}
        >
          {meetDetailData.meetDto.minLiverPoint > 0 && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src="/src/assets/liver.svg"
                width="20rem"
                style={{ marginRight: "3px" }}
              />
              <div>{meetDetailData.meetDto.minLiverPoint}</div>
              IU/L
            </div>
          )}
          {hasAgeLimit && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src="/src/assets/age.svg"
                width="20rem"
                style={{ marginRight: "3px" }}
              />
              나이 제한
            </div>
          )}
        </div>
        <MeetTitle>우리가 마실 것은</MeetTitle>
        <ListInfoItem
          title="주류의 이름이 들어갑니다"
          imgSrc="../src/assets/ForTest/backgroundImg.jpg"
          tag="주종"
          content="주류에 대한 간략한 정보가 여기에"
          numberInfo={"후기 수 " + 3}
          isWaiting={false}
          outLine={false}
          routingFunc={GoBackHandler}
        />
        <MeetTitle>모임 소개</MeetTitle>
        <div
          style={{
            color: "var(--c-black)",
            fontFamily: "Noto Sans KR",
            fontSize: "15px",
            textAlign: "left",
            marginTop: "0.5rem",
          }}
        >
          아침이 겨울이 마디씩 위에 이름과, 쓸쓸함과 오는 했던 하나에 봅니다. 내
          내린 쉬이 아름다운 오는 걱정도 사람들의 까닭입니다. 이름과, 가을로 별
          언덕 이제 있습니다. 나의 나의 봄이 까닭이요, 별 듯합니다.쉬이 위에
          내일 나의 까닭입니다. 가득 아스라히 이름과, 많은 못 하나에 이네들은
          까닭입니다.무엇인지 노루, 언덕 이름자 있습니다. 것은 하나의 하나에
          겨울이 버리었습니다. 이름과, 밤이 이름과, 릴케 별들을 오면 지나고
          하나에 있습니다.
        </div>
        <div style={{ display: "flex" }}>
          <MeetTitle>참여 인원</MeetTitle>
          <div
            style={{
              marginTop: "1.6rem",
              marginLeft: "0.5rem",
            }}
          >
            <PeopleNumInfo now={4} max={4} color="var(--c-black)" size={13} />
          </div>
        </div>
        <div style={{ margin: "0 0.5rem" }}>
          {memberList.map((member, index) => {
            return (
              <UserInfoItem
                key={index}
                userId={member.userId}
                name={member.nickname}
                intro={member.intro}
                imgSrc="../src/assets/tempgif.gif"
                isMaster={index === 0}
                width={15}
              />
            );
          })}
        </div>
      </MeetDetailDiv>
      <MeetPosDateDiv>
        <div>
          <img src="/src/assets/mapPinColor.svg" width="20rem" />
          <div>모임 예정 시, 구</div>
          <div>상세 위치</div>
        </div>
        <div>
          <img src="/src/assets/calendarColor.svg" width="20rem" />
          <div>모임 날짜</div>
          <div>시간 상세</div>
        </div>
      </MeetPosDateDiv>
      <footer>
        <FooterBigBtn
          content="모임 관리"
          reqFunc={() => GotoMeetManageHandler(parseInt(meetId))}
          color="var(--c-yellow)"
          bgColor="var(--c-lightgray)"
        />
      </footer>
    </div>
  );
};
export default MeetingDetail;
