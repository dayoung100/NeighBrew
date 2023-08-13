package com.ssafy.backend.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import java.io.IOException;

import java.util.List;

// 서버가 Firebase 계정임을 인증하는 작업
@Configuration
@Slf4j
public class FcmConfiguration{
    @Value("${fcm.key.path}")
    private String FCM_KEY_PATH;

    @Value("${fcm.project.name}")
    private String FCM_PROJECT_NAME;
    @Bean // google인증 라이브러리와 firebase 사용자인증을 수행한다.
    public GoogleCredentials getGoogleCredentials() throws IOException {
        return GoogleCredentials
                .fromStream(new ClassPathResource(FCM_KEY_PATH).getInputStream());
    }

    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(getGoogleCredentials())
                .build();
        log.info(">> FCM 초기화 완료 <<");
        return FirebaseApp.initializeApp(options);
    }

}

//@Component
//@Slf4j
//public class FcmConfiguration {
//    @Value("${fcm.key.path}")
//    private String FCM_KEY_PATH;
//
//    @Value("${fcm.scope}")
//    private String FCM_SCOPEH;
//
//    @Value("${fcm.project.name}")
//    private String FCM_PROJECT_NAME;
//
//    @PostConstruct
//    public void initialize() throws IOException {
//        ClassPathResource resource = new ClassPathResource(FCM_KEY_PATH);
//
//        //서버에서 유저가 로그인 할 떄 FCM토큰을 발급 받도록 한다.
//        try(InputStream refreshToken= resource.getInputStream()){
//            FirebaseOptions options = FirebaseOptions.builder()
//                    .setCredentials(GoogleCredentials.fromStream(refreshToken))
//                    .setProjectId(FCM_PROJECT_NAME)
//                    .build();
//
//            if(FirebaseApp.getApps().isEmpty()){
//                FirebaseApp.initializeApp(options);
//                log.info("FCM 등록 성공");
//            }
//        }
//    }
//}
//https://developers.google.com/identity/protocols/oauth2/scopes?hl=ko#fcm