import { Meeting, MeetDetail, Drink, User } from "../Type/types";

export const initialMeet: Meeting = {
  meetId: 0,
  meetName: "",
  hostId: 0,
  description: "",
  nowParticipants: 0,
  maxParticipants: 8,
  meetDate: "0000-01-01T00:00:00",
  tagId: 0,
  sido: "-",
  gugun: "-",
  imgSrc: "",
};

export const initialMeetDetail: MeetDetail = {
  meetDto: {
    meetId: 0,
    meetName: "",
    description: "",
    nowParticipants: 0,
    maxParticipants: 8,
    meetDate: "9999-01-01T00:00:00",
    tagId: 1,
    sido: "",
    gugun: "",
    minAge: 20,
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

export const initialDrink: Drink = {
  degree: 0,
  description: "",
  drinkId: 0,
  image: "",
  name: "",
  tagId: 0,
};

export const initialUser: User = {
  userId: 0,
  email: "",
  nickname: "",
  name: "",
  liverPoint: 0,
  profile: "",
  follower: 0,
  following: 0,
};

export const initialSido = {
  sidoCode: 0,
  sidoName: "-",
};

export const initialGugun = {
  gugunCode: 0,
  gugunName: "-",
};

//모달창 디자인
export const WhiteModal = {
  content: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "15rem",
    // height: "6rem",
    padding: "0.5rem 1rem",
    borderRadius: "15px",
    background: "white",
    overflow: "auto",
    textAlign: "center",
    fontFamily: "NanumSquareNeo",
    WebkitOverflowScrolling:
      "touch" /* overflow가 일어날 경우 모바일 기기에서 부드러운 가속이 적용된 스크롤이 되도록 해주는 속성 */,
  },
  overlay: {
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: "11",
  },
};
