package com.ssafy.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.firebase.FirebaseApp;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.ssafy.backend.config.WebMvcConfig;
import com.ssafy.backend.dto.FCMDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;


@Service
@Slf4j
@RequiredArgsConstructor
public class FcmService {

    private final ObjectMapper objectMapper;

    public String sendPushNotification(String deviceToken, String body, String url) {
        Message message = Message.builder()
                .setToken(deviceToken)
                .setNotification(Notification.builder().setTitle("Neighbrew").setBody(body).build())
                .putData("url", url)
                .build();

        try {
            String response = FirebaseMessaging.getInstance().send(message);
        } catch (Exception e) {
            log.info("Error sending FCM message:  {}", e.getMessage());
        }
    }
}
