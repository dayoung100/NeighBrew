self.addEventListener("install", e => {
  console.log("[Service Worker] installed");
});

// activate event
self.addEventListener("activate", e => {
  console.log("[Service Worker] actived", e);
});

// fetch event
self.addEventListener("fetch", e => {
  console.log("[Service Worker] fetched resource " + e.request.url);
});

// self.addEventListener("push", event => {
//   const options = {
//     body: event.data.text(),
//     icon: "path/to/icon.png", // 알림 아이콘 경로
//     badge: "path/to/badge.png", // 뱃지 아이콘 경로
//   };

//   event.waitUntil(self.registration.showNotification("알림 제목", options));
// });
