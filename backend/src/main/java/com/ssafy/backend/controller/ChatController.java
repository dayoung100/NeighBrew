package com.ssafy.backend.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.backend.dto.ChatMessageDto;
import com.ssafy.backend.entity.ChatMessage;
import com.ssafy.backend.entity.ChatRoom;
import com.ssafy.backend.repository.ChatMessageRepository;
import com.ssafy.backend.repository.ChatRoomRepository;
import com.ssafy.backend.repository.ChatRoomUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.time.LocalDateTime;

@Slf4j
@Controller
@CrossOrigin("*")
@RequiredArgsConstructor
public class ChatController {
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatRoomUserRepository chatRoomUserRepository;

    // 연결
    @MessageMapping("/messages")
    public void sendMessage(@Payload String chatMessage) {
        log.info("연결:{}", chatMessage);
        // 채팅 메시지를 받아서 해당 채팅방의 유저들에게 전송
        messagingTemplate.convertAndSend("/pub/messages", chatMessage);
    }


    @MessageMapping("/chat/{roomId}/sendMessage")
    public void sendMessage(@DestinationVariable Long roomId, @Payload String data) throws JsonProcessingException {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 채팅방입니다."));
        ObjectMapper mapper = new ObjectMapper();
        log.info("mapper: {}", mapper);
        JsonNode jsonNode = mapper.readTree(data);
        log.info("jsonNode: {}", jsonNode);

        // 현재방에 유저가 참여했는지 판단
        if (chatRoomUserRepository.findByChatRoomAndUser_UserId(chatRoom, jsonNode.get("userId").asLong()).isEmpty()) {
            throw new IllegalArgumentException("채팅방에 참여하지 않은 유저가 메시지를 보냈습니다.");
        }


        ChatMessageDto chatMessageDto = ChatMessageDto
                .builder()
                .userId(jsonNode.get("userId").asLong())
                .message(jsonNode.get("message").asText())
                .build();


        log.info("chatMessageDto: {}", chatMessageDto);

        // 채팅 메시지를 받아서 해당 채팅방의 유저들에게 전송
        ChatMessage chatMessage = ChatMessage.builder()
                .chatRoom(chatRoom)
                .message(chatMessageDto.getMessage())
                .userId(chatMessageDto.getUserId())
                .timestamp(LocalDateTime.now())
                .build();

        chatMessageRepository.save(chatMessage);
        log.info("room id : " + roomId);
        log.info("chatMessage: {}", new ObjectMapper().writeValueAsString(chatMessageDto));
        messagingTemplate.convertAndSend("/pub/messages", new ObjectMapper().writeValueAsString(chatMessageDto));
        messagingTemplate.convertAndSend("/pub/room/" + roomId, data);
    }
}
