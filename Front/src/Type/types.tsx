export interface User {
  userId: number;
  email: string;
  nickname: string;
  name: string;
  birth?: string;
  intro?: string;
  liverPoint: number;
  profile: string;
  follower: number;
  following: number;
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

export interface Drink {
  degree: number;
  description: string;
  drinkId: number;
  image: string;
  name: string;
  tagId: number;
}
