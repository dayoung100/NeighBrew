//경로 VITE 프로젝트 src/util

import {initializeApp} from "firebase/app";
import {getMessaging, getToken, onMessage} from "firebase/messaging";

const config = {
    apiKey: import.meta.env.env.VITE_APP_FCM_API_KEY,
    authDomain: import.meta.env.env.VITE_APP_FCM_AUTH_DOMAIN,
    projectId: import.meta.env.env.VITE_APP_FCM_PROJECT_ID,
    storageBucket: import.meta.env.env.VITE_APP_FCM_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.env.VITE_APP_FCM_MESSAGING_SENDER_ID,
    appId: import.meta.env.env.VITE_APP_FCM_APP_ID 
};

const app = initializeApp(config);
const messaging = getMessaging();

//토큰값 얻기
getToken(messaging, {
    vapidKey:
        import.meta.env.env.VITE_APP_FCM_VAPID  ,
})
    .then((currentToken) => {
        if (currentToken) {
            // Send the token to your server and update the UI if necessary
            // ...
            console.log(currentToken);
        } else {
            // Show permission request UI
            console.log(
                "No registration token available. Request permission to generate one."
            );
            // ...
        }
    })
    .catch((err) => {
        console.log("An error occurred while retrieving token. ", err);
        // ...
    });

//포그라운드 메시지 수신
onMessage(messaging, (payload) => {
    console.log("Message received. ", payload);
    // ...
});
