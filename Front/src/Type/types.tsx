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
  drinkcount?: number;
}
export interface Message {
  chatMessageId: number;
  chatRoom: ChatRoom;
  user: User;
  message: string;
  createdAt: string;
}
export interface Chat {
  chatMessageId?: number;
  message?: string;
  user?: User;
  createdAt?: string;
  chatRoom?: ChatRoom;
  userid?: number;
}

export interface ChatRoom {
  chatRoomId?: number;
  chatRoomName?: string;
}
//모임 인터페이스
export interface Meeting {
  meetId: number;
  meetName: string;
  description: string;
  host?: User;
  hostId?: number;
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
  drink?: Drink;
  imgSrc: string;
}

//미팅 상세 정보 type
export type MeetDetail = {
  meetDto: Meeting;
  users: User[];
  statuses: [];
};

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
  likeCount: number;
}
// 특정 유저의 팔로잉과 팔로워 목록을 보여줌
export interface Followers {
  followerId: number; // 그냥 pk임
  follower: User[];
  following: User[];
}

export interface SubReview {
  subReviewId: number;
  content: string;
  createdAt: string;
  drinkReview: Review;
  user: User;
}
