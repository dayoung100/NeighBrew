export interface User {
  userId: number;
  email: string;
  nickname: string;
  name: string;
  password: string;
  phone: string;
  birth: string;
  intro: string;
  createdAt: string;
  updatedAt: string;
  liverPoint: number;
  profileImg: string;
  deleted: boolean;
  oauthProvider: string;
}
export interface Chat {
  message: string;
  userid: number;
}

//모임을 리스트로 받을 때
export interface Meetings {
  meetId: number;
  meetName: string;
  description: string;
  hostId: number;
  nowParticipants: number;
  maxParticipants: number;
  meetDate: string;
  tag: {
    tagId: number;
    name: string;
  };
  sido: string;
  gugun: string;
  dong: string;
  minAge?: number;
  maxAge?: number;
  minLiverPoint?: number;
  attendUser: null;
  drink: {
    drinkId: number;
    name: string;
    image: string;
    degree: number;
    description: string;
    tagId: number;
  };
  imgSrc: string;
}
