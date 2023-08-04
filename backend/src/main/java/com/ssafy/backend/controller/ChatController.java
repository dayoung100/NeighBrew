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

    //단체 메세지를 보낸다.
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

    //dm 참여 및 메세지 전송
    @MessageMapping("/dm/{senderId}/{receiverId}/sendMessage")
    public void createChatOrSend(@DestinationVariable Long receiverId,
                                 @DestinationVariable Long senderId,
                                 @Payload String payload) throws JsonProcessingException {
        Map<String, Object> sendData = chatDmRoomService.createChatOrSend(receiverId, payload);

        messagingTemplate.convertAndSend("/pub/dm/" + senderId + "/" + receiverId, mapper.writeValueAsString(sendData));
    }

    //dm떠나기
    @Transactional
    @MessageMapping("/dm/{dmRoomId}/leave")
    public void leaveDm(@DestinationVariable Long dmRoomId,
                        @Payload String payload) throws JsonProcessingException {
        String sendData = chatDmRoomService.leaveDm(dmRoomId, payload);
        messagingTemplate.convertAndSend("/pub/dm/" + dmRoomId, sendData);
    }

}
