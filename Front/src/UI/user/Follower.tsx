import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { arrowLeftIcon, outRoom } from "../../assets/AllIcon";
import SearchBox from "../components/SearchBox";
import { useState, useEffect, useRef } from "react";
import Footer from "../footer/Footer";
import autoAnimate from "@formkit/auto-animate";

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

const Follower = () => {
  const navigate = useNavigate();
  const goBackHandler = () => {
    navigate(-1);
  };
  const ArrowLeftIcon = arrowLeftIcon("var(--c-black)");
  const [users, setUsers] = useState([
    "현욱",
    "현빈",
    "준서",
    "다영",
    "영교",
    "동혁",
    "현욱",
    "현빈",
    "준서",
    "다영",
    "영교",
    "동혁",
    "현욱",
    "현빈",
    "준서",
    "다영",
    "영교",
    "동혁",
    "현욱",
    "현빈",
    "준서",
    "다영",
    "영교",
    "동혁",
  ]);
  const [inp, setInp] = useState("");
  const parent = useRef(null);
  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);
  const temp = () => {
    setUsers([...users, "현욱"]);
  };
  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInp(e.target.value);
  };
  const findUser = () => {
    const user = ["현욱", "현빈", "준서", "다영", "영교", "동혁"];
    if (inp === "") return setUsers(["현욱", "현빈", "준서", "다영", "영교", "동혁"]);
    setUsers(prev => {
      return user.filter(user => user.includes(inp));
    });
  };
  //   useEffect(() => {
  //     findUser();
  //   }, [inp]);

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
          <span style={{ marginRight: "0rem", fontFamily: "JejuGothic", fontSize: "20px" }}>
            팔로워 목록
          </span>
          <div></div>
          {/* 이 div는 중앙 정렬을 위한 임의의 div임 */}
        </ChatNav>
      </header>
      <div style={{ width: "90%", margin: "0 auto" }}>
        <SearchBox placeholder="유저 닉네임 검색" />
      </div>
      <input type="text" onChange={inputHandler} value={inp} />
      <div ref={parent}>
        {users.map((user, idx) => {
          return (
            <User>
              <ImgDiv>
                <Img src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg" />
              </ImgDiv>
              <div style={{ textAlign: "left" }}>
                <p
                  style={{ fontFamily: "JejuGothic", fontSize: "16px", marginBottom: "0.5rem" }}
                  key={idx}
                >
                  {user}
                </p>
                <p style={{ fontFamily: "SeoulNamsan", fontSize: "14px" }}>
                  유저 한줄 소개인데 글을 길게 쓰는 테스트를 위해서 막말을 하자
                </p>
              </div>
            </User>
          );
        })}
      </div>
      <div style={{ height: "80px" }}></div>
      <footer>
        <Footer />
      </footer>
    </>
  );
};
export default Follower;
