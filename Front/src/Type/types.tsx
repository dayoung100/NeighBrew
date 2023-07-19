export interface SignUpData {
  email: string;
  password: string;
  phoneNumber: string;
}
export interface DrinkPost {
  title: string;
  image: string;
  id: number;
  tag: string[];
  userId: number;
  description: string;
}
export interface UserData {
  profileImage: string;
  name: string;
  nickname: string;
  tags: string[];
  userId: number;
  // followers :
}

export interface Comment {
  userId: number;
  description: string;
  comment: string[];
  likes: number[]; // 좋아요 누른 사람들
}

export interface Meeting {
  userId: number; // 주최자
  participants: number[]; // 참가자
  tags: string[]; // 태그
  title: string; // 제목
}
