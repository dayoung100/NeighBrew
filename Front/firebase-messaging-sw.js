// import { initializeApp } from "firebase/app";
// import { getMessaging, getToken, onMessage } from "firebase/messaging";
// const firebaseConfig = {
//   apiKey: "AIzaSyAj-406BFv0qHt8L-vpW7Ath__ZDGO1rsY",
//   authDomain: "neighbrew-b1e78.firebaseapp.com",
//   projectId: "neighbrew-b1e78",
//   storageBucket: "neighbrew-b1e78.appspot.com",
//   messagingSenderId: "735404055230",
//   appId: "1:735404055230:web:2e96cd5b4a74eb6f8bdcef",
//   measurementId: "G-P18G2K2JJN",
// };
// importScripts("https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js");
// importScripts("https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js");

// firebase.initializeApp(firebaseConfig);
// self.addEventListener("install", function (e) {
//   console.log("fcm sw install..");
//   self.skipWaiting();
// });

// self.addEventListener("activate", function (e) {
//   console.log("fcm sw activate..");
// });
self.addEventListener("push", function (e) {
  if (!e.data.json()) return;

  const resultData = e.data.json().notification;
  const notificationTitle = resultData.title;
  const notificationOptions = {
    body: resultData.body,
    icon: resultData.image, // 웹 푸시 이미지는 icon
    tag: resultData.tag,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
// const app = initializeApp(firebaseConfig);
// const messaging = getMessaging(app);

// async function requestPermission() {
//   console.log("권한 요청 중...");

//   const permission = await Notification.requestPermission();
//   if (permission === "denied") {
//     console.log("알림 권한 허용 안됨");
//     return;
//   }

//   console.log("알림 권한이 허용됨");

//   const token = await getToken(messaging, {
//     vapidKey:
//       "BIx1uyEnAZKWSIOmMoK7gtdqA2ERTXDHJBLz9u6qNUaO-GTOLSlBcGj1bbH_XHYGA6pG5bgaFXZZzBADzsgNFWo",
//   });

//   if (token) console.log("token: ", token);
//   else console.log("Can not get Token");
// }

// onMessage(messaging, payload => {
//   console.log("메시지가 도착했습니다.", payload);
//   // ...
// });

// requestPermission();
