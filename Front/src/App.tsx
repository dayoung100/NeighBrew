import { useState, useEffect } from "react";
import "./App.css";
import { useNavigate, Route, Routes } from "react-router-dom";
import FirstLoading from "./UI/etc/FirstLoading";
import Login from "./UI/user/Login";
import Main from "./UI/home/Main";
import ChatList from "./UI/chat/ChatList";
import ChatRoom from "./UI/chat/ChatRoom";
import DrinkpostTotal from "./UI/drinkpost/DrinkpostTotal";
import MeetingMain from "./UI/meet/MeetingMain";
import MeetingDetail from "./UI/meet/MeetingDetail";
import MeetingCreate from "./UI/meet/MeetingCreate";
import MeetingManageMain from "./UI/meet/MeetingManageMain";
import MeetingMemberManage from "./UI/meet/MeetingMemberManage";
import MeetingInfoManage from "./UI/meet/MeetingInfoManage";
import Mypage from "./UI/user/MyPage";
import Follower from "./UI/user/Follower";
import Follow from "./UI/user/Follow";
import KakaoLogin from "./UI/user/KakaoLogin";
import NaverLogin from "./UI/user/NaverLogin";
import GoogleLogin from "./UI/user/GoogleLogin";
import DrinkpostDetail from "./UI/drinkpost/DrinkpostDetail";
import DrinkpostCreate from "./UI/drinkpost/DrinkpostCreate";
import DrinkpostSearch from "./UI/drinkpost/DrinkpostSearch";
import DrinkpostReviewCreate from "./UI/drinkpost/DrinkpostReviewCreate";
import Test from "./Test";
import DrinkpostMain from "./UI/drinkpost/DrinkpostMain";
import DrinkpostReviewDetail from "./UI/drinkpost/DrinkpostReviewDetail";
import DirectChat from "./UI/chat/DirectChat";
import SearchUser from "./UI/user/SearchUser";
import RatingCreate from "./UI/meetrate/RatingCreate";

import React from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const navigate = useNavigate();
  const [isLodaing, setIsLoading] = useState(true); // 개발시 isLoading true로 두고 하기

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(true);
      console.log(isLodaing);
    }, 3000);
  }, []);
  const notify = (message: string) => {
    // alert("승인함");
    if (!("Notification" in window)) {
      alert("승인안함");
    } else if (Notification.permission === "granted") {
      const notification = new Notification(message);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          const notification = new Notification(message);
        }
      });
    }
  };

  const event = new EventSource("https://i9b310.p.ssafy.io/api/push/connect/11", {
    withCredentials: true,
  });
  event.addEventListener("open", e => {
    console.log("연결완료");
  });
  event.addEventListener("sse", e => {
    console.log(e.data);
  });
  event.addEventListener("FOLLOW", e => {
    notify(JSON.parse(e.data).content);
    console.log(JSON.parse(e.data));
  });
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
        {/* <Route path="/" element={<MeetingMain></MeetingMain>}></Route> */}
        <Route path="/home" element={<Main />} />
        <Route path="/drinkpost" element={<DrinkpostMain />} />
        <Route path="/meet" element={<MeetingMain />}></Route>
        <Route path="/meet/:meetId" element={<MeetingDetail />}></Route>
        <Route path="/meet/create" element={<MeetingCreate />}></Route>
        <Route path="/meet/:meetId/manage" element={<MeetingManageMain />}></Route>
        <Route path="/meet/:meetId/manage/member" element={<MeetingMemberManage />}></Route>
        <Route path="/meet/:meetId/manage/info" element={<MeetingInfoManage />}></Route>

        <Route path="/myPage/:userid" element={<Mypage></Mypage>}></Route>
        <Route path="/myPage/follower/:userid" element={<Follower></Follower>}></Route>
        <Route path="/myPage/follow/:userid" element={<Follow></Follow>}></Route>
        <Route path="/usersearch" element={<SearchUser></SearchUser>}></Route>
        <Route path="/chatList" element={<ChatList></ChatList>}></Route>
        <Route path="/chatList/:id" element={<ChatRoom></ChatRoom>} />
        <Route path="/directchat/:senderId/:receiverId" element={<DirectChat></DirectChat>}></Route>

        <Route path="/kakao/:str" element={<KakaoLogin></KakaoLogin>}></Route>
        <Route path="/naver/:str" element={<NaverLogin></NaverLogin>}></Route>
        <Route path="/google/:str" element={<GoogleLogin></GoogleLogin>}></Route>

        <Route path="/drinkpost/:drinkId" element={<DrinkpostDetail></DrinkpostDetail>}></Route>
        <Route path="/drinkpost/create" element={<DrinkpostCreate></DrinkpostCreate>}></Route>
        <Route path="/drinkpost/search" element={<DrinkpostSearch></DrinkpostSearch>}></Route>
        <Route
          path="/drinkpost/:drinkId/review/create"
          element={<DrinkpostReviewCreate></DrinkpostReviewCreate>}
        ></Route>
        <Route path="/drinkpost/total" element={<DrinkpostTotal></DrinkpostTotal>}></Route>
        <Route path="/test" element={<Test></Test>}></Route>

        <Route path="/rating" element={<RatingCreate></RatingCreate>}></Route>

        <Route
          path="/drinkpost/:drinkId/:reviewId"
          element={<DrinkpostReviewDetail></DrinkpostReviewDetail>}
        ></Route>
      </Routes>
    </>
  );
}

export default App;
