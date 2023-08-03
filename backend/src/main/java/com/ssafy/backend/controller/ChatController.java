package com.ssafy.backend.controller;

import aj.org.objectweb.asm.TypeReference;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.backend.service.ChatDmRoomService;
import com.ssafy.backend.service.ChatRoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.sql.OracleJoinFragment;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import javax.transaction.Transactional;
import java.util.Map;

@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatController {
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatRoomService chatRoomService;
    private final ChatDmRoomService chatDmRoomService;
    private final ObjectMapper mapper = new ObjectMapper();

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

    @MessageMapping("/dm/{senderId}/{receiverId}/")
    public void createChatOrSend(@DestinationVariable Long senderId,
                                 @DestinationVariable Long receiverId,
                                 @Payload Map<String, Object> payLoad){
        String message = (String) payLoad.get("message");
        Long userId = (Long) payLoad.get("userId");
        String userNickName = (String) payLoad.get("userNickName");
        log.info("{}, {}, {}", message, userNickName, userId);
        //String res = chatDmRoomService.createChatOrSend(senderId, receiverId, message);
        //messagingTemplate.convertAndSend("/pub/chat/" + senderId + "/" + receiverId, res);
    }
}
