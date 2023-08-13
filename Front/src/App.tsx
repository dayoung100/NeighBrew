import { useState, useEffect } from "react";
import "./App.css";
import { useNavigate, Route, Routes } from "react-router-dom";
import FirstLoading from "./UI/etc/FirstLoading";
import Loading from "./UI/etc/Loading";
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
import logo from "./assets/logoNavbar.svg";
import DrinkpostReviewUpdate from "./UI/drinkpost/DrinkpostReviewUpdate";
// import "./firebase-messaging-sw.js";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

function App() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); // 개발시 isLoading true로 두고 하기
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(true);
      console.log(isLoading);
    }, 3000);
  }, []);

  const firebaseConfig = {
    apiKey: "AIzaSyAj-406BFv0qHt8L-vpW7Ath__ZDGO1rsY",
    authDomain: "neighbrew-b1e78.firebaseapp.com",
    projectId: "neighbrew-b1e78",
    storageBucket: "neighbrew-b1e78.appspot.com",
    messagingSenderId: "735404055230",
    appId: "1:735404055230:web:2e96cd5b4a74eb6f8bdcef",
    measurementId: "G-P18G2K2JJN",
  };

  const app = initializeApp(firebaseConfig);
  const messaging = getMessaging(app);

  async function requestPermission() {
    console.log("권한 요청 중...");

    const permission = await Notification.requestPermission();
    if (permission === "denied") {
      console.log("알림 권한 허용 안됨");
      return;
    }

    console.log("알림 권한이 허용됨");

    const token = await getToken(messaging, {
      vapidKey:
        "BIx1uyEnAZKWSIOmMoK7gtdqA2ERTXDHJBLz9u6qNUaO-GTOLSlBcGj1bbH_XHYGA6pG5bgaFXZZzBADzsgNFWo",
    });

    if (token) console.log("token: ", token);
    else console.log("Can not get Token");
  }
  onMessage(messaging, payload => {
    console.log("메시지가 도착했습니다.", payload);
    // ...
  });

  requestPermission();

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              {!isLoading && <FirstLoading />}
              {isLoading && <Login></Login>}
            </>
          }
        />
        {/* <Route path="/" element={<MeetingMain></MeetingMain>}></Route> */}
        {/* <Route path="/home" element={<Main />} /> */}
        {/* TODO: isLoading을 키면 여기 Main으로 바꿔야 */}
        <Route path="/home" element={<Loading />} />
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

        <Route path="/rating/:meetId" element={<RatingCreate></RatingCreate>}></Route>

        <Route
          path="/drinkpost/:drinkId/:reviewId"
          element={<DrinkpostReviewDetail></DrinkpostReviewDetail>}
        ></Route>
        <Route
          path="/drinkpost/:drinkId/:reviewId/update"
          element={<DrinkpostReviewUpdate></DrinkpostReviewUpdate>}
        ></Route>
      </Routes>
    </>
  );
}

export default App;
