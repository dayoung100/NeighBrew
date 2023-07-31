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
  createdAt?: string;
  updatedAt?: string;
  oauthProvider?: string;
}
export interface Chat {
  message: string;
  userid: number;
}

//모임 인터페이스
export interface Meeting {
  meetId: number;
  meetName: string;
  description: string;
  hostId: number;
  nowParticipants: number;
  maxParticipants: number;
  meetDate: string;
  tagId: number;
  sido: string;
  gugun: string;
  dong: string;
  minAge?: number;
  maxAge?: number;
  minLiverPoint?: number;
  drink: Drink;
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

export interface Review {
  content: string;
  drink: Drink;
  drinkReviewId: number;
  img: string;
  user: User;
}
// 특정 유저의 팔로잉과 팔로워 목록을 보여줌
export interface Followers {
  followerId: number; // 그냥 pk임
  follower: User[];
  following: User[];
}
