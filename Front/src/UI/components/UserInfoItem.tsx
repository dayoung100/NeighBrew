import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const UserProfileImg = styled.img`
  width: 4rem;
  border-radius: 100px;
`;

type UserInfoItemProps = {
  userId: number; //유저 아이디
  name: string; //유저 닉네임
  intro: string; //유저 한마디
  imgSrc: string; //유저 프로필 이미지 경로
  isMaster?: boolean; //유저가 모임의 주최자인지 아닌지
  width?: number; //텍스트 영역이 가질 너비(단위rem)
};

/**
 * 유저의 이름과 한마디만을 포함해 보여주는 요소.
 * 모임, 팔팔 목록 등 각종 유저 목록에 이용 됨
 * @property {number} userId 유저 아이디
 * @property {string} name 유저 닉네임
 * @property {string} intro 유저 한마디
 * @property {string} imgSrc 유저 프로필 이미지 경로
 * @property {boolean} isMaster [Optional] 유저가 모임의 주최자인지 아닌지
 * @property {number} width [Optional] 텍스트 영역이 가질 너비(단위rem, 기본 15)
 * @todo userId를 받으면 name, intro, imgSrc는 props로 안받아도 될듯?!
 */
const UserInfoItem = (props: UserInfoItemProps) => {
  const navigate = useNavigate();
  //   라우팅 링크는 추후 변경될 수 있음
  const GotoUserDetailHandler = (userId: number) => {
    console.log("goto user detail page, userId is: ", userId);
    navigate(`/myPage/${userId}`);
  };
  const width = props.width ? props.width : 15;

  return (
    <div
      style={{ display: "flex", marginTop: "0.5rem" }}
      onClick={() => GotoUserDetailHandler(props.userId)}
    >
      <UserProfileImg src={props.imgSrc} />
      <div style={{ margin: "auto 0 auto 0.5rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div style={{ fontFamily: "JejuGothic", fontSize: "15px" }}>
            {props.name}
          </div>
          {props.isMaster && <img src="/src/assets/star.svg" />}
        </div>
        <div
          style={{
            fontFamily: "Noto Sans KR",
            fontSize: "15px",
            color: "var(--c-gray)",
            width: `${width}rem`,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            textAlign: "left",
          }}
        >
          {props.intro}
        </div>
      </div>
    </div>
  );
};
export default UserInfoItem;
