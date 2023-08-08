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
import { callApi } from "../../utils/api";
import { MeetDetail, User } from "../../Type/types";

const MeetThumbnail = styled.div<{ $bgImgSrc: string }>`
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url(${(props) => props.$bgImgSrc}) no-repeat center;
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
  font-family: "NanumSquareNeo";
  font-size: 12px;
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

const UserProfileImg = styled.div<{ src: string }>`
  background: url(${(props) => props.src}) no-repeat center;
  background-size: cover;
  width: 2rem;
  padding-bottom: 2rem;
  border-radius: 100px;
  margin-right: 0.2rem;
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
  top: -2rem;
  left: 50%;
  transform: translate(-50%, 0%);
  z-index: 2;
  width: 17rem;
  height: 4rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.07);
  padding: 1rem;
  font-family: "NanumSquareNeo";
  font-size: 16px;
`;

const MeetTitle = styled.div`
  font-family: "JejuGothic";
  font-size: 20px;
  text-align: left;
  margin-top: 1.5rem;
`;

const initialUser = {
  userId: 0,
  email: "",
  nickname: "",
  name: "",
  liverPoint: 0,
  profile: "",
  follower: 0,
  following: 0,
};

const initialData: MeetDetail = {
  meetDto: {
    meetId: 0,
    meetName: "",
    description: "",
    host: initialUser,
    nowParticipants: 0,
    maxParticipants: 0,
    meetDate: "0000-01-01T00:00:00",
    tagId: 0,
    sido: "-",
    gugun: "-",
    dong: "-",
    drink: {
      degree: 0,
      description: "",
      drinkId: 0,
      image: "",
      name: "",
      tagId: 0,
    },
    imgSrc: "",
  },
  users: [],
  statuses: [],
};

const MeetingDetail = () => {
  const ArrowLeftIcon = arrowLeftIcon("white");
  const { meetId } = useParams(); //meetId는 라우터 링크에서 따오기
  const [meetDetailData, setMeetDetailData] = useState<MeetDetail>(initialData); //모임 데이터
  const [memberList, setMemberList] = useState<User[]>([]); //참여자 리스트
  const [userId, setUserId] = useState(0); //현재 유저의 userId
  const [userStatus, setUserStatus] = useState("");
  const bgImg =
    meetDetailData.meetDto.imgSrc == null ||
    meetDetailData.meetDto.imgSrc == "no image"
      ? "/src/assets/meetDefaultImg.jpg"
      : meetDetailData.meetDto.imgSrc;

  //네비게이터 : 모임 관리 페이지로 이동, 뒤로가기 기능
  const navigate = useNavigate();
  const GoBackHandler = () => {
    navigate(-1);
  };
  const GotoMeetManageHandler = (meetId: number) => {
    navigate(`/meet/${meetId}/manage`);
  };
  const GotoDrinkPostHandler = (drinkId: number) => {
    navigate(`/drinkpost/${drinkId}`);
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  //api 호출
  useEffect(() => {
    const promise = callApi("get", `api/meet/${meetId}`);
    promise.then((res) => {
      setMeetDetailData(res.data); //받아온 데이터로 meetDetailData 세팅
    });
    //로컬 스토리지에서 userId 가져오기
    setUserId(parseInt(localStorage.getItem("myId")));
  }, [meetId]);

  useEffect(() => {
    if (meetDetailData !== undefined) {
      //users에서 apply인 유저 제외하고 memberList에 넣기
      let members = meetDetailData.users.filter(
        (user, index) => meetDetailData.statuses[index] !== "APPLY"
      );
      setMemberList(members);
      //유저 상태를 관리(HOST/GUEST/APPLY/NONE)
      let index: number | undefined = meetDetailData.users.findIndex(
        (user) => user.userId === userId
      );
      setUserStatus(index === -1 ? "NONE" : meetDetailData.statuses[index]);
    }
  }, [meetDetailData]);

  //참여 신청하기
  function applyMeet() {
    const promise = callApi("post", `api/meet/apply`, {
      userId: userId,
      meetId: meetId,
    });
    promise
      .then((res) => {
        setUserStatus("APPLY");
      })
      .catch((err) => console.log(err));

    console.log("참여 신청했어요");
  }

  //신청 취소하기
  function cancelApply() {
    const promise = callApi("put", `api/meet/apply-cancel`, {
      userId: userId,
      meetId: meetId,
    });
    promise.then((res) => {
      setUserStatus("NONE");
    });
  }

  //모임 나가기
  function exitMeet() {
    const promise = callApi("delete", `api/meet/exit`, {
      userId: userId,
      meetId: meetId,
    });
    promise.then((res) => {
      setUserStatus("NONE");
    });
    console.log("모임을 나갔어요");
  }

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

  //날짜와 변환 함수
  function formateDate(dateData: string) {
    const date = new Date(dateData);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${month}월 ${day}일`;
  }

  //시간 변환 함수
  function formateTime(dateData: string) {
    const date = new Date(dateData);
    const hour = date.getHours();
    const minute = date.getMinutes();

    return `${hour}시 ${minute}분`;
  }

  return (
    <div style={{ color: "var(--c-black)" }}>
      <MeetThumbnail $bgImgSrc={bgImg}>
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
              fontSize: "28px",
              margin: "0 auto 0.5rem auto",
              width: "20rem",
            }}
          >
            {meetDetailData.meetDto.meetName}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "NanumSquareNeo",
              fontSize: "16px",
            }}
          >
            <div>주최자: </div>
            {memberList[0] && (
              <div style={{ display: "flex", alignItems: "center" }}>
                <UserProfileImg src={memberList[0].profile} />
                <div>{memberList[0].nickname}</div>
              </div>
            )}
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
        <MeetPosDateDiv>
          <div>
            <img src="/src/assets/mapPinColor.svg" width="20rem" />
            <div>{`${meetDetailData.meetDto.sido}시`}</div>
            <div>{`${meetDetailData.meetDto.gugun}  ${meetDetailData.meetDto.dong}`}</div>
          </div>
          <div>
            <img src="/src/assets/calendarColor.svg" width="20rem" />
            <div>{formateDate(meetDetailData.meetDto.meetDate)}</div>
            <div>{formateTime(meetDetailData.meetDto.meetDate)}</div>
          </div>
        </MeetPosDateDiv>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            fontSize: "14px",
            fontFamily: "NanumSquareNeo",
          }}
        >
          {(meetDetailData.meetDto.minLiverPoint ?? 0) > 0 && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src="/src/assets/liverIcon.svg"
                width="20rem"
                style={{ marginRight: "3px" }}
              />
              <div>{meetDetailData.meetDto.minLiverPoint}</div>
              IU/L
            </div>
          )}
          {hasAgeLimit() && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src="/src/assets/age.svg"
                width="20rem"
                style={{ marginRight: "3px" }}
              />
              {meetDetailData.meetDto.minAge > 0 && (
                <div>{meetDetailData.meetDto.minAge}세 이상</div>
              )}
              {meetDetailData.meetDto.maxAge > 0 && (
                <div>~{meetDetailData.meetDto.maxAge}세 미만</div>
              )}
            </div>
          )}
        </div>
        <MeetTitle>우리가 마실 것은</MeetTitle>
        <ListInfoItem
          title={meetDetailData.meetDto.drink.name}
          imgSrc="../src/assets/star.svg"
          tag={getTagName(meetDetailData.meetDto.drink.tagId)}
          content={meetDetailData.meetDto.drink.description}
          outLine={false}
          routingFunc={() =>
            GotoDrinkPostHandler(meetDetailData.meetDto.drink.drinkId)
          }
        />
        <MeetTitle>모임 소개</MeetTitle>
        <div
          style={{
            color: "var(--c-black)",
            fontFamily: "NanumSquareNeo",
            fontSize: "16px",
            textAlign: "justify",
            lineHeight: "1.6rem",
            marginTop: "0.5rem",
            marginBottom: "2rem",
            whiteSpace: "pre-line",
          }}
        >
          {meetDetailData.meetDto.description}
        </div>
        <div style={{ display: "flex" }}>
          <MeetTitle>참여 인원</MeetTitle>
          <div
            style={{
              marginTop: "1.6rem",
              marginLeft: "0.5rem",
            }}
          >
            <PeopleNumInfo
              now={meetDetailData.meetDto.nowParticipants}
              max={meetDetailData.meetDto.maxParticipants}
              color="var(--c-black)"
              size={13}
            />
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
                imgSrc={member.profile}
                isMaster={index === 0}
                width={15}
              />
            );
          })}
        </div>
      </MeetDetailDiv>
      {userStatus === "HOST" && (
        //user 상태에 따라 버튼 변경
        <FooterBigBtn
          content="모임 관리"
          reqFunc={() => GotoMeetManageHandler(parseInt(meetId))}
          color="var(--c-yellow)"
          bgColor="var(--c-lightgray)"
        />
      )}
      {userStatus === "GUEST" && (
        <FooterBigBtn
          content="모임 나가기"
          reqFunc={() => exitMeet()} //모임 나가기
          color="#F28F79"
          bgColor="var(--c-lightgray)"
        />
      )}
      {userStatus === "APPLY" && (
        <FooterBigBtn
          content="승인 대기 중"
          reqFunc={() => cancelApply()} //참여신청 취소하기
          color="var(--c-gray)"
          bgColor="var(--c-lightgray)"
        />
      )}
      {userStatus === "NONE" && (
        <FooterBigBtn
          content="참여 신청하기"
          reqFunc={() => applyMeet()} //참여신청하기
          color="var(--c-yellow)"
          bgColor="var(--c-lightgray)"
        />
      )}
    </div>
  );
};
export default MeetingDetail;
