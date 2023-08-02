package com.ssafy.backend.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.ssafy.backend.service.ChatRoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.transaction.Transactional;

@Slf4j
@Controller
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatRoomService chatRoomService;

    @MessageMapping("/chat/{roomId}/sendMessage")
    public void sendMessage(@DestinationVariable Long roomId, @Payload String data) throws JsonProcessingException {
        String res = chatRoomService.sendMessage(roomId, data);
        messagingTemplate.convertAndSend("/pub/room/" + roomId, res);
    }

    // 채팅방 퇴장
    @Transactional
    @MessageMapping("/room/{roomId}/leave")
    public void leaveChatRoom(@DestinationVariable Long roomId, @Payload String data) throws JsonProcessingException {
        String res = chatRoomService.leaveChatRoom(roomId, data);
        messagingTemplate.convertAndSend("/pub/room/" + roomId, res);
    }
}
