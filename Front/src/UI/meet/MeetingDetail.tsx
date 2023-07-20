/*
[MeetingDetail.tsx]
특정한 모임의 상세 정보를 보여주는 페이지
모임 리스트에서 하나를 클릭하면 이 페이지로 이동함
모임 타이틀, 태그, 주최자, 위치, 시간, 선택한 술, 모임 소개, 참여자 리스트 출력
*/
import { useNavigate } from "react-router-dom";
import { arrowLeftIcon } from "../../assets/AllIcon";
import styled from "styled-components";
import PeopleNumInfo from "./PeopleNumInfo";
import ListInfoItem from "../components/ListInfoItem";
import backgroundImg from "../../assets/ForTest/backgroundImg.jpg";
import Footer from "../footer/Footer";

const MeetThumbnail = styled.div`
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url(${backgroundImg}) no-repeat center;
  background-size: cover;
  width: 100%;
  height: 30vh;
  color: white;
`;

const Tag = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--c-yellow);
  padding: 1.5% 2%;
  font-family: "SeoulNamsan";
  font-size: 7px;
  border-radius: 10px;
  color: var(--c-black);
  &::before {
    content: "";
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: white;
    margin-right: 2px;
  }
  span {
    display: flex;
    justify-content: center;
    min-width: 30px;
  }
`;

const MeetDetailDiv = styled.div`
  background: var(--c-lightgray);
  height: 70vh;
  border-radius: 30px 30px 0px 0px;
  position: relative;
  z-index: 1;
  top: -2rem;
  padding: 4.5rem 1rem;
`;

const MeetPosDateDiv = styled.div`
  position: absolute;
  top: 12rem;
  left: 50%;
  transform: translate(-50%, 0%);
  z-index: 2;
  width: 17rem;
  height: 4rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.07);
  padding: 1rem;
  font-family: "SeoulNamsan";
  font-size: 16px;
`;

const MeetTitle = styled.div`
  font-family: "JejuGothic";
  font-size: 20px;
  text-align: left;
  margin-top: 1.5rem;
`;

const MeetingDetail = () => {
  const ArrowLeftIcon = arrowLeftIcon("white");
  const navigate = useNavigate();

  const GoBackHandler = () => {
    navigate(-1);
  };

  return (
    <div style={{ color: "var(--c-black)" }}>
      <MeetThumbnail>
        <div
          style={{
            display: "flex",
            textAlign: "left",
            padding: "1rem",
          }}
        >
          <div
            style={{ cursor: "pointer", marginRight: "1rem" }}
            onClick={GoBackHandler}
          >
            {ArrowLeftIcon}
          </div>
          <Tag>소주/맥주</Tag>
        </div>
        <div style={{ textAlign: "center", padding: "2rem 0 7rem 0" }}>
          <div
            style={{
              fontFamily: "JejuGothic",
              fontSize: "32px",
              marginBottom: "0.5rem",
            }}
          >
            모임의 제목이 들어갑니다
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="../src/assets/tempgif.gif"
              width="20rem"
              style={{ borderRadius: "100px" }}
            />
            <div style={{ fontFamily: "SeoulNamsan", fontSize: "15px" }}>
              주최자 이름이 들어갑니다
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <PeopleNumInfo now={1} max={4} color="white" size={11} />
          </div>
        </div>
      </MeetThumbnail>
      <MeetDetailDiv>
        <div>각종 제한들</div>
        <MeetTitle>우리가 마실 것은</MeetTitle>
        <ListInfoItem
          title="주류의 이름이 들어갑니다"
          imgSrc="../src/assets/ForTest/backgroundImg.jpg"
          tag="주종"
          content="주류에 대한 간략한 정보가 여기에"
          numberInfo={"후기 수 " + 3}
          isWaiting={false}
          routingFunc={null}
        />
        <MeetTitle>모임 소개</MeetTitle>
        <div
          style={{
            color: "var(--c-black)",
            fontFamily: "Noto Sans KR",
            fontSize: "15px",
            textAlign: "left",
            marginTop: "0.5rem",
          }}
        >
          아침이 겨울이 마디씩 위에 이름과, 쓸쓸함과 오는 했던 하나에 봅니다. 내
          내린 쉬이 아름다운 오는 걱정도 사람들의 까닭입니다. 이름과, 가을로 별
          언덕 이제 있습니다. 나의 나의 봄이 까닭이요, 별 듯합니다.쉬이 위에
          내일 나의 까닭입니다. 가득 아스라히 이름과, 많은 못 하나에 이네들은
          까닭입니다.무엇인지 노루, 언덕 이름자 있습니다. 것은 하나의 하나에
          겨울이 버리었습니다. 이름과, 밤이 이름과, 릴케 별들을 오면 지나고
          하나에 있습니다.
        </div>
        <div style={{ display: "flex" }}>
          <MeetTitle>참여 인원</MeetTitle>
          <div style={{ marginTop: "1.3rem", marginLeft: "0.5rem" }}>
            <PeopleNumInfo now={1} max={4} color="var(--c-black)" size={20} />
          </div>
        </div>
      </MeetDetailDiv>
      <MeetPosDateDiv>
        모임 예정 장소와 시간, z-index올리고 position absolute로
      </MeetPosDateDiv>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};
export default MeetingDetail;
