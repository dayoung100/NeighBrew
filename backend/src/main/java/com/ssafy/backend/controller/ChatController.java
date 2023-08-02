package com.ssafy.backend.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.backend.dto.ChatMessageDto;
import com.ssafy.backend.entity.ChatMessage;
import com.ssafy.backend.entity.ChatRoom;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.ChatMessageRepository;
import com.ssafy.backend.repository.ChatRoomRepository;
import com.ssafy.backend.repository.ChatRoomUserRepository;
import com.ssafy.backend.repository.UserRepository;
import com.ssafy.backend.service.ChatRoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatRoomUserRepository chatRoomUserRepository;
    private final ChatRoomService chatRoomService;
    private final UserRepository userRepository;

    // 연결
    @MessageMapping("/messages")
    public void sendMessage(@Payload String chatMessage) {
        log.info("연결:{}", chatMessage);
        // 채팅 메시지를 받아서 해당 채팅방의 유저들에게 전송
        messagingTemplate.convertAndSend("/pub/messages", chatMessage);
    }

    // 유저 아이디로 채팅방 조회
    @GetMapping("/{userId}/getChatRoom")
    public ResponseEntity<?> getUserChatRooms(@PathVariable Long userId) {
        return ResponseEntity.ok(chatRoomService.findUserChatRooms(userId));
    }

    @MessageMapping("/chat/{roomId}/sendMessage")
    public void sendMessage(@DestinationVariable Long roomId, @Payload String data) throws JsonProcessingException {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 채팅방입니다."));
        ObjectMapper mapper = new ObjectMapper();
        JsonNode jsonNode = mapper.readTree(data);
        User user = userRepository.findById(jsonNode.get("userId").asLong()).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다."));
        Map<String, Object> map = mapper.convertValue(jsonNode, Map.class);
        map.put("userNickname", user.getNickname());
        log.info("map: {}", map);


        // 현재방에 유저가 참여했는지 판단
        if (chatRoomUserRepository.findByChatRoomAndUser_UserId(chatRoom, jsonNode.get("userId").asLong()).isEmpty()) {
            throw new IllegalArgumentException("채팅방에 참여하지 않은 유저가 메시지를 보냈습니다.");
        }


        ChatMessageDto chatMessageDto = ChatMessageDto
                .builder()
                .message(jsonNode.get("message").asText())
                .user(userRepository.findById(jsonNode.get("userId").asLong()).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다.")))
                .build();


        // 채팅 메시지를 받아서 해당 채팅방의 유저들에게 전송
        ChatMessage chatMessage = ChatMessage.builder()
                .chatRoom(chatRoom)
                .message(chatMessageDto.getMessage())
                .user(chatMessageDto.getUser())
                .timestamp(LocalDateTime.now())
                .build();

        chatMessageRepository.save(chatMessage);
        messagingTemplate.convertAndSend("/pub/room/" + roomId, mapper.writeValueAsString(map));
    }

    // 채팅방 퇴장
    @Transactional
    @MessageMapping("/room/{roomId}/leave")
    public void leaveChatRoom(@DestinationVariable Long roomId, @Payload String data) throws JsonProcessingException {
        ChatRoom room = chatRoomRepository.findById(roomId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 채팅방입니다.")); // 채팅방 조회
        Long userId = Long.valueOf(new ObjectMapper().readTree(data).get("userId").asText());
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다.")); // 유저 조회

        // ChatRoomUser 삭제
        chatRoomUserRepository.deleteByUser_UserIdAndChatRoom_ChatRoomId(userId, roomId);
        chatRoomUserRepository.flush();


        // 빈방 삭제
        if (room.getUsers().isEmpty()) {
            chatRoomRepository.delete(room);
        }

        ChatMessage message = ChatMessage.builder()
                .message(user.getName() + "님이 퇴장하셨습니다.")
                .timestamp(LocalDateTime.now())
                .user(user)
                .build();
        chatMessageRepository.save(message);
        messagingTemplate.convertAndSend("/pub/room/" + roomId, message);
    }
}
