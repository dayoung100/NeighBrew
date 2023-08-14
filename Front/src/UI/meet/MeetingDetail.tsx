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
import { initialMeetDetail, encodeUrl } from "../common";
import { MeetDetail, User } from "../../Type/types";
import defaultImg from "../../assets/defaultImg.png";

const MeetThumbnail = styled.div<{ $bgImgSrc: string }>`
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url(${(props) => props.$bgImgSrc}) no-repeat center;
  background-size: cover;
  width: 100%;
  min-height: 30vh;
  color: white;
`;

const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  text-align: left;
  padding: 1rem;
`;

const Tag = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--c-yellow);
  padding: 0.5rem 1rem;
  font-family: "NanumSquareNeoBold";
  font-size: 12px;
  border-radius: 20px;
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

const Title = styled.div`
  font-family: "JejuGothic";
  font-size: 28px;
  margin: 0 auto 0.5rem auto;
  width: 20rem;
`;

const HostInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "NanumSquareNeo";
  font-size: 16px;
  margin: 0.5rem 0;
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

const SubTitle = styled.div`
  font-family: "JejuGothic";
  font-size: 20px;
  text-align: left;
  margin-top: 1.5rem;
`;

const Description = styled.div`
  color: var(--c-black);
  font-family: "NanumSquareNeo";
  font-size: 16px;
  text-align: justify;
  line-height: 1.6rem;
  margin-top: 0.5rem;
  margin-bottom: 2rem;
  white-space: pre-line;
  word-break: break-all;
`;

const MeetingDetail = () => {
  const ArrowLeftIcon = arrowLeftIcon("white");
  const { meetId } = useParams(); //meetId는 라우터 링크에서 따오기
  const [meetDetailData, setMeetDetailData] =
    useState<MeetDetail>(initialMeetDetail); //모임 데이터
  const [memberList, setMemberList] = useState<User[]>([]); //참여자 리스트
  const [userId, setUserId] = useState(0); //현재 유저의 userId
  const [userStatus, setUserStatus] = useState("");
  const bgImg =
    meetDetailData.meet.imgSrc == "no image"
      ? "/src/assets/meetDefaultImg.jpg"
      : meetDetailData.meet.imgSrc;

  const navigate = useNavigate();
  //뒤로가기
  const GoBackHandler = () => {
    navigate(-1);
  };
  //모임 관리 페이지로 이동
  const GotoMeetManageHandler = (meetId: number) => {
    navigate(`/meet/${meetId}/manage`);
  };
  //특정 술로 이동
  const GotoDrinkPostHandler = (drinkId: number) => {
    navigate(`/drinkpost/${drinkId}`);
  };
  //없는 모임일 경우 모임 메인으로 이동
  const GotoMainHandler = () => {
    navigate(`/meet`, { replace: true });
  };

  //api호출
  const fetchMeetData = () => {
    const promise = callApi("get", `api/meet/${meetId}`);
    promise
      .then((res) => {
        setMeetDetailData(res.data); //받아온 데이터로 meetDetailData 세팅
      })
      .catch((e) => {
        console.log(e);
        GotoMainHandler();
      });
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    //로컬 스토리지에서 userId 가져오기
    setUserId(parseInt(localStorage.getItem("myId")));
  }, []);

  //meetId가 생기면 api로 데이터 로드
  useEffect(() => {
    fetchMeetData();
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
    promise
      .then((res) => {
        setUserStatus("NONE");
      })
      .then(() => fetchMeetData());
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
      (meetDetailData.meet.minAge ?? 0) > 0 ||
      (meetDetailData.meet.maxAge ?? 0) > 0
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
        <DetailHeader>
          <div
            style={{ cursor: "pointer", marginRight: "1rem" }}
            onClick={GoBackHandler}
          >
            {ArrowLeftIcon}
          </div>
          <Tag>{getTagName(meetDetailData.meet.tagId)}</Tag>
        </DetailHeader>
        <div style={{ textAlign: "center", padding: "2rem 0 7rem 0" }}>
          <Title>{meetDetailData.meet.meetName}</Title>
          <HostInfo>
            <div>주최자: </div>
            {memberList[0] && (
              <div style={{ display: "flex", alignItems: "center" }}>
                <UserProfileImg
                  src={
                    memberList[0].profile === "no image"
                      ? defaultImg
                      : memberList[0].profile
                  }
                />
                <div>{memberList[0].nickname}</div>
              </div>
            )}
          </HostInfo>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <PeopleNumInfo
              now={meetDetailData.meet.nowParticipants}
              max={meetDetailData.meet.maxParticipants}
              color="white"
              size={15}
            />
          </div>
        </div>
      </MeetThumbnail>
      <MeetDetailDiv>
        <MeetPosDateDiv>
          <div>
            <img src="/src/assets/mapPinColor.svg" width="20rem" />
            <div>{`${meetDetailData.meet.sido.sidoName}`}</div>
            <div>{`${meetDetailData.meet.gugun.gugunName}`}</div>
          </div>
          <div>
            <img src="/src/assets/calendarColor.svg" width="20rem" />
            <div>{formateDate(meetDetailData.meet.meetDate)}</div>
            <div>{formateTime(meetDetailData.meet.meetDate)}</div>
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
          {(meetDetailData.meet.minLiverPoint ?? 0) > 0 && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src="/src/assets/liverIcon.svg"
                width="20rem"
                style={{ marginRight: "3px" }}
              />
              <div>{meetDetailData.meet.minLiverPoint}</div>
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
              {meetDetailData.meet.minAge > 0 && (
                <div>{meetDetailData.meet.minAge}세 이상</div>
              )}
              {meetDetailData.meet.maxAge > 0 && (
                <div>~{meetDetailData.meet.maxAge}세 미만</div>
              )}
            </div>
          )}
        </div>
        <SubTitle>우리가 마실 것은</SubTitle>
        <ListInfoItem
          title={meetDetailData.meet.drink.name}
          imgSrc={
            meetDetailData.meet.drink.image === "no image"
              ? "/src/assets/whiskeyImage.png"
              : encodeUrl(meetDetailData.meet.drink.image)
          }
          tag={getTagName(meetDetailData.meet.drink.tagId)}
          content={meetDetailData.meet.drink.description}
          outLine={false}
          isDrink={true}
          routingFunc={() =>
            GotoDrinkPostHandler(meetDetailData.meet.drink.drinkId)
          }
        />
        <SubTitle>모임 소개</SubTitle>
        <Description>{meetDetailData.meet.description}</Description>
        <div style={{ display: "flex" }}>
          <SubTitle>참여 인원</SubTitle>
          <div
            style={{
              marginTop: "1.6rem",
              marginLeft: "0.5rem",
            }}
          >
            <PeopleNumInfo
              now={meetDetailData.meet.nowParticipants}
              max={meetDetailData.meet.maxParticipants}
              color="var(--c-black)"
              size={15}
            />
          </div>
        </div>
        <div style={{ margin: "0 0.5rem" }}>
          {memberList.map((member, index) => {
            return (
              <UserInfoItem
                key={member.userId}
                user={member}
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
