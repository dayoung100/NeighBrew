import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { arrowLeftIcon, outRoom } from "../../assets/AllIcon";
import SearchBox from "../components/SearchBox";
import { useState, useEffect, useRef } from "react";
import Footer from "../footer/Footer";
import autoAnimate from "@formkit/auto-animate";
import { User as userType } from "../../Type/types";
import { callApi } from "../../utils/api";
import temgif from "../../assets/temgif.gif";

const Follow = () => {
  const navigate = useNavigate();
  const goBackHandler = () => {
    navigate(-1);
  };
  const ArrowLeftIcon = arrowLeftIcon("var(--c-black)");
  // const [users, setUsers] = useState<User[]>([]);
  const [users, setUsers] = useState<userType[]>([]);
  const parent = useRef(null);
  const { userid } = useParams();
  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  const getFollower = () => {
    callApi("get", `api/follow/following/${userid}`).then((res) => {
      res.data.map((tem) => {
        setUsers((users) => [...users, tem.following]);
      });
      console.log(res.data);
    });
  };
  useEffect(() => {
    getFollower();
  }, []);
  return (
    <>
      <header>
        <ChatNav>
          <div
            style={{
              textAlign: "center",
              cursor: "pointer",
            }}
            onClick={goBackHandler}
          >
            {ArrowLeftIcon}
          </div>
          <span
            style={{
              marginRight: "0rem",
              fontFamily: "JejuGothic",
              fontSize: "1.25rem",
            }}
          >
            팔로워 목록
          </span>
          <div></div>
          {/* 이 div는 중앙 정렬을 위한 임의의 div임 */}
        </ChatNav>
      </header>
      <div style={{ width: "90%", margin: "0 auto" }}>
        <SearchBox placeholder="유저 닉네임 검색" />
      </div>
      <div ref={parent}>
        {users.map((user, idx) => {
          return (
            <User
              onClick={() => {
                navigate("/myPage/" + user.userId);
              }}
              style={{ cursor: "pointer" }}
              key={idx}
            >
              <ImgDiv>
                <Img src={user.profile == "no image" ? temgif : user.profile} />
              </ImgDiv>
              <div style={{ textAlign: "left" }}>
                <p
                  style={{
                    fontFamily: "JejuGothic",
                    fontSize: "1rem",
                    marginBottom: ".5rem",
                  }}
                >
                  {user.nickname}
                </p>
                <p style={{ fontFamily: "SeoulNamsan", fontSize: ".875rem" }}>
                  {user.intro}
                </p>
              </div>
            </User>
          );
        })}
      </div>
      <div style={{ height: "5rem" }}></div>
      <footer>
        <Footer />
      </footer>
    </>
  );
};
export default Follow;

const ChatNav = styled.div`
  box-sizing: border-box;
  padding: 0.5rem;
  width: 100%;
  height: 3rem;
  display: flex;
  word-break: break-all;
  font-size: 0.9rem;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const User = styled.div`
  width: 90%;
  margin: 1.5rem 1rem;
  display: flex;
`;
const ImgDiv = styled.div`
  width: 15%;
  height: 100%;
  overflow: hidden;
  /* inline-size: 25ch; */
  aspect-ratio: 1/1;
  border-radius: 50%;
  float: left;
  margin-right: 2rem;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
