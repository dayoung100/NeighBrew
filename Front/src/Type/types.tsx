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
