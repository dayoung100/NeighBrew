package com.ssafy.backend.controller;

import com.ssafy.backend.entity.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;

import java.time.LocalDateTime;

@Controller
public class ChatController {

    private SimpMessagingTemplate messagingTemplate;

    public ChatController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat/{roomId}/sendMessage")
    public void sendMessage(@PathVariable Long roomId, @Payload ChatMessage chatMessage) {
        // 채팅 메시지를 받아서 해당 채팅방의 유저들에게 전송
        chatMessage.setTimestamp(LocalDateTime.now());
        messagingTemplate.convertAndSend("/pub/room/" + roomId, chatMessage);
    }
}
