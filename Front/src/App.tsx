import { useState, useEffect } from "react";
import "./App.css";
import { useNavigate, Route, Routes } from "react-router-dom";
import FirstLoading from "./UI/etc/FirstLoading";
import Login from "./UI/user/Login";
import Main from "./UI/home/Main";
import ChatList from "./UI/chat/ChatList";
import ChatRoom from "./UI/chat/ChatRoom";
import Drinkpost from "./UI/drinkpost/DrinkpostMain";
import MeetingMain from "./UI/meet/MeetingMain";
import MeetingDetail from "./UI/meet/MeetingDetail";
import Mypage from "./UI/user/MyPage";
import Follower from "./UI/user/Follower";
import Follow from "./UI/user/Follow";
import KakaoLogin from "./UI/user/KakaoLogin";
import NaverLogin from "./UI/user/NaverLogin";
import GoogleLogin from "./UI/user/GoogleLogin";

function App() {
  const navigate = useNavigate();
  const [isLodaing, setIsLoading] = useState(true); // 개발시 isLoading true로 두고 하기

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(true);
      console.log(isLodaing);
    }, 3000);
  }, []);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              {!isLodaing && <FirstLoading />}
              {isLodaing && <Login></Login>}
            </>
          }
        />
        <Route
          path="/home"
          element={
            <>
              <Main />
            </>
          }
        />
        <Route
          path="/drinkpost"
          element={
            <>
              <Drinkpost />
            </>
          }
        />
        <Route path="/meet" element={<MeetingMain />}></Route>
        <Route path="/meet/:meetId" element={<MeetingDetail />}></Route>
        <Route path="/myPage/:userid" element={<Mypage></Mypage>}></Route>
        <Route path="/myPage/follower/:userid" element={<Follower></Follower>}></Route>
        <Route path="/myPage/follow/:userid" element={<Follower></Follower>}></Route>
        <Route path="/chatList" element={<ChatList></ChatList>}></Route>
        <Route path="/chatList/:roomId" element={<ChatRoom></ChatRoom>} />
        <Route path="/kakao/:str" element={<KakaoLogin></KakaoLogin>}></Route>
        <Route path="/naver/:str" element={<NaverLogin></NaverLogin>}></Route>
        <Route path="/google/:str" element={<GoogleLogin></GoogleLogin>}></Route>
      </Routes>
    </>
  );
}

export default App;
