import { MeetDetail, Drink } from "../Type/types";

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

export const initialSido = {
  sidoCode: 0,
  sidoName: "-",
};

export const initialGugun = {
  gugunCode: 0,
  gugunName: "-",
};
