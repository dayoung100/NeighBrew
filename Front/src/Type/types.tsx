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

export interface Meeting {
  meetId: number;
  meetName: string;
  description: string;
  hostId: number;
  attendUser: number;
  meetDate: string;
  tag: any;
  sido: string;
  gugun: string;
  dong: string;
  minAge?: number | null;
  maxAge?: number | null;
  minLiverPoint?: number | null;
}
