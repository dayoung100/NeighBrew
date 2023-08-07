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
import org.springframework.web.bind.annotation.PathVariable;

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
    @MessageMapping("/dm/{user1Id}/{user2Id}/sendMessage")
    public void createChatOrSend(@DestinationVariable Long user1Id,
                                 @DestinationVariable Long user2Id,
                                 @Payload String payload) throws JsonProcessingException {

        Map<String, Object> sendData = user1Id.compareTo(user2Id) < 0
                ? chatDmRoomService.createChatOrSend(user1Id, user2Id, payload)
                : chatDmRoomService.createChatOrSend(user2Id, user1Id, payload);
        messagingTemplate.convertAndSend("/pub/dm/" + user1Id + "/" + user2Id, mapper.writeValueAsString(sendData));
    }

    //dm떠나기
    @Transactional
    @MessageMapping("/dm/{user1Id}/{user2Id}/leave")
    public void leaveDm(@DestinationVariable Long user1Id,
                        @DestinationVariable Long user2Id,
                        @Payload String payload) throws JsonProcessingException {

        //유저 아이디 값을 비교해서 작은 것을 앞으로 보낸다.
        String sendData = user1Id.compareTo(user2Id) < 0
                ? chatDmRoomService.leaveDm(user1Id, user2Id, payload)
                : chatDmRoomService.leaveDm(user2Id, user1Id, payload);
        messagingTemplate.convertAndSend("/pub/dm/" + user1Id + "/" + user2Id, sendData);
    }

}
