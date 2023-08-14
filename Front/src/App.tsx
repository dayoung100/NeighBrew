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
import NotFound from "./UI/etc/NotFound";
import logo from "./assets/logoNavbar.svg";
import DrinkpostReviewUpdate from "./UI/drinkpost/DrinkpostReviewUpdate";

function App() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // 개발시 isLoading true로 두고 하기
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(true);
      console.log(isLoading);
    }, 1000);
  }, []);

  // const userid = localStorage.getItem("myId");

  // useEffect(() => {
  //   const event = new EventSource(
  //     `https://i9b310.p.ssafy.io/api/push/connect/${userid}`,
  //     {
  //       withCredentials: true,
  //     }
  //   );
  //   event.addEventListener("open", (e) => {
  //     console.log("연결완료");
  //   });
  //   event.addEventListener("sse", (e) => {
  //     console.log(e.data);
  //   });
  //   event.addEventListener("FOLLOW", (e) => {
  //     console.log(JSON.parse(e.data));
  //     noti(JSON.parse(e.data).content);
  //   });

  //   return () => {
  //     event.close();
  //     event.removeEventListener("open", () => {});
  //     event.removeEventListener("sse", () => {});
  //     event.removeEventListener("FOLLOW", () => {});
  //   };
  // });

  // useEffect(() => {
  //   subscribe();
  // }, []);
  // const subscribe = () => {
  //   if (!("Notification" in window)) {
  //     // 브라우저가 Notification API를 지원하는지 확인한다.
  //     alert("알림을 지원하지 않는 데스크탑 브라우저입니다");
  //     return;
  //   }

  //   if (Notification.permission === "granted") {
  //     // 이미 알림 권한이 허가됐는지 확인한다.
  //     // 그렇다면, 알림을 표시한다.
  //     // const notification = new Notification("안녕하세요!");
  //     return;
  //   }

  //   // 알림 권한이 거부된 상태는 아니라면
  //   if (Notification.permission !== "denied") {
  //     // 사용자에게 알림 권한 승인을 요청한다
  //     Notification.requestPermission().then((permission) => {
  //       // 사용자가 승인하면, 알림을 표시한다
  //       if (permission === "granted") {
  //         const notification = new Notification("알림을 허용하셨습니다.");
  //       }
  //     });
  //   }
  // };
  // const noti = (message: string) => {
  //   navigator.serviceWorker.ready.then((registration) => {
  //     const notiAlarm = registration.showNotification("NeighBrew", {
  //       body: message,
  //       icon: logo,
  //       actions: [
  //         {
  //           title: "화면 이동",
  //           action: "goTab",
  //         },
  //         {
  //           title: "닫기",
  //           action: "close",
  //         },
  //       ],
  //     });
  //   });
  // };
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              {!isLoading && <Loading />}
              {isLoading && <Login></Login>}
            </>
          }
        />
        {/* <Route path="/" element={<MeetingMain></MeetingMain>}></Route> */}
        {/* <Route path="/home" element={<Main />} /> */}
        {/* TODO: isLoading을 키면 여기 Main으로 바꿔야 */}
        <Route path="/home" element={<Main />} />
        <Route path="/drinkpost" element={<DrinkpostMain />} />
        <Route path="/meet" element={<MeetingMain />}></Route>
        <Route path="/meet/:meetId" element={<MeetingDetail />}></Route>
        <Route path="/meet/create" element={<MeetingCreate />}></Route>
        <Route
          path="/meet/:meetId/manage"
          element={<MeetingManageMain />}
        ></Route>
        <Route
          path="/meet/:meetId/manage/member"
          element={<MeetingMemberManage />}
        ></Route>
        <Route
          path="/meet/:meetId/manage/info"
          element={<MeetingInfoManage />}
        ></Route>

        <Route path="/myPage/:userid" element={<Mypage></Mypage>}></Route>
        <Route
          path="/myPage/follower/:userid"
          element={<Follower></Follower>}
        ></Route>
        <Route
          path="/myPage/follow/:userid"
          element={<Follow></Follow>}
        ></Route>
        <Route path="/usersearch" element={<SearchUser></SearchUser>}></Route>
        <Route path="/chatList" element={<ChatList></ChatList>}></Route>
        <Route path="/chatList/:id" element={<ChatRoom></ChatRoom>} />
        <Route
          path="/directchat/:senderId/:receiverId"
          element={<DirectChat></DirectChat>}
        ></Route>

        <Route path="/kakao/:str" element={<KakaoLogin></KakaoLogin>}></Route>
        <Route path="/naver/:str" element={<NaverLogin></NaverLogin>}></Route>
        <Route
          path="/google/:str"
          element={<GoogleLogin></GoogleLogin>}
        ></Route>

        <Route
          path="/drinkpost/:drinkId"
          element={<DrinkpostDetail></DrinkpostDetail>}
        ></Route>
        <Route
          path="/drinkpost/create"
          element={<DrinkpostCreate></DrinkpostCreate>}
        ></Route>
        <Route
          path="/drinkpost/search"
          element={<DrinkpostSearch></DrinkpostSearch>}
        ></Route>
        <Route
          path="/drinkpost/:drinkId/review/create"
          element={<DrinkpostReviewCreate></DrinkpostReviewCreate>}
        ></Route>
        <Route
          path="/drinkpost/total"
          element={<DrinkpostTotal></DrinkpostTotal>}
        ></Route>
        <Route path="/test" element={<Test></Test>}></Route>

        <Route
          path="/rating/:meetId"
          element={<RatingCreate></RatingCreate>}
        ></Route>

        <Route
          path="/drinkpost/:drinkId/:reviewId"
          element={<DrinkpostReviewDetail></DrinkpostReviewDetail>}
        ></Route>
        <Route
          path="/drinkpost/:drinkId/:reviewId/update"
          element={<DrinkpostReviewUpdate></DrinkpostReviewUpdate>}
        ></Route>
        <Route path="/*" element={<NotFound></NotFound>}></Route>
      </Routes>
    </>
  );
}

export default App;
