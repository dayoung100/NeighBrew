package com.ssafy.backend.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.backend.service.ChatDmService;
import com.ssafy.backend.service.ChatRoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
    private final ChatDmService chatDmService;
    private final ObjectMapper mapper = new ObjectMapper();

    //단체 메세지를 보낸다.
    @MessageMapping("/chat/{roomId}/sendMessage")
    public void sendMessage(@DestinationVariable Long roomId, @Payload String data) throws JsonProcessingException {
        String res = chatRoomService.sendMessage(roomId, data);
        messagingTemplate.convertAndSend("/pub/room/" + roomId, res);
    }

    // 채팅방 퇴장
    @MessageMapping("/room/{roomId}/leave")
    public void leaveChatRoom(@DestinationVariable Long roomId, @Payload String data) throws JsonProcessingException {
        String res = chatRoomService.leaveChatRoom(roomId, data);
        messagingTemplate.convertAndSend("/pub/room/" + roomId, res);
    }

    //dm 참여 및 메세지 전송
    @MessageMapping("/dm/{user1Id}/{user2Id}")
    public void createChatOrSend(@DestinationVariable("user1Id") Long user1Id,
                                 @DestinationVariable("user2Id") Long user2Id,
                                 @Payload String payload) throws JsonProcessingException {

        log.info("메세지 생성 밑 반환 접근");
        Map<String, Object> sendData = user1Id.compareTo(user2Id) < 0
                ? chatDmService.createChatOrSend(user1Id, user2Id, payload)
                : chatDmService.createChatOrSend(user2Id, user1Id, payload);
        messagingTemplate.convertAndSend("/pub/dm/" + user1Id + "/" + user2Id, mapper.writeValueAsString(sendData));
    }

    //dm떠나기
    @MessageMapping("/dm/{user1Id}/{user2Id}/leave")
    public void leaveDm(@DestinationVariable("user1Id") Long user1Id,
                        @DestinationVariable("user2Id") Long user2Id,
                        @Payload String payload) throws JsonProcessingException {

        //유저 아이디 값을 비교해서 작은 것을 앞으로 보낸다.
        String sendData = user1Id.compareTo(user2Id) < 0
                ? chatDmService.leaveDm(user1Id, user2Id, payload)
                : chatDmService.leaveDm(user2Id, user1Id, payload);
        messagingTemplate.convertAndSend("/pub/dm/" + user1Id + "/" + user2Id, sendData);
    }
}
