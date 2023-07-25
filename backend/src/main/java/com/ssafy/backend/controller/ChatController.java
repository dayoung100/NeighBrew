package com.ssafy.backend.controller;

import com.ssafy.backend.entity.ChatMessage;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;

    // 연결
    @MessageMapping("/messages")
    public void sendMessage(@Payload String chatMessage) {
        // 채팅 메시지를 받아서 해당 채팅방의 유저들에게 전송
        messagingTemplate.convertAndSend("/pub/messages", chatMessage);
    }


    @MessageMapping("/guard/chat/{roomId}/sendMessage")
    public void sendMessage(@DestinationVariable Long roomId, @Payload String chatMessage, HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        // 채팅 메시지를 받아서 해당 채팅방의 유저들에게 전송
        log.info("room id : " + roomId);
//        chatMessage.setTimestamp(LocalDateTime.now());
        messagingTemplate.convertAndSend("/pub/room/" + roomId, chatMessage);
    }
}
