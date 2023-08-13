package com.ssafy.backend.controller;

import com.google.firebase.messaging.FirebaseMessagingException;
import com.ssafy.backend.service.FcmService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController("/api/fcm")
@Slf4j
@RequiredArgsConstructor
public class FcmController {

    @Value("${neighbrew.url}")
    private String neighbrewUrl;
    private FcmService fcmService;
    @GetMapping("/send/token")
    public String sendToToken() throws FirebaseMessagingException {

        String registrationToken = "토큰을 입력해주세요.";
        return fcmService.sendPushNotification(registrationToken, "테스트 메세지 전송", neighbrewUrl + "/meet");
    }
}
