package com.ssafy.backend.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.backend.entity.ChatMessage;
import com.ssafy.backend.entity.ChatRoom;
import com.ssafy.backend.entity.ChatRoomUser;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.ChatMessageRepository;
import com.ssafy.backend.repository.ChatRoomRepository;
import com.ssafy.backend.repository.ChatRoomUserRepository;
import com.ssafy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@CrossOrigin("*")
@RequestMapping("/api/chat")
public class ChatRoomController {
    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatRoomUserRepository chatRoomUserRepository;
    private final ChatMessageRepository chatMessageRepository;


    // 채팅방 생성
    @PostMapping("/room")
    public ResponseEntity<ChatRoom> createChatRoom(@RequestBody Map<String, String> map) {
        ChatRoom room = ChatRoom.builder()
                .chatRoomName(map.get("name"))
                .build();
        chatRoomRepository.save(room);
        return ResponseEntity.ok(room);
    }


    // 채팅방 입장 (채팅방에 유저 추가)
    @MessageMapping("/room/{roomId}/join")
    public void joinChatRoom(@DestinationVariable Long roomId, @Payload String data) throws JsonProcessingException {
        Long userId = Long.valueOf(new ObjectMapper().readTree(data).get("userId").asText());

        ChatRoom room = chatRoomRepository.findById(roomId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 채팅방입니다."));
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다."));

        chatRoomUserRepository.findByUser_UserIdAndChatRoom_ChatRoomId(user.getUserId(), room.getChatRoomId()).ifPresent(
                chatRoomUser -> {
                    throw new IllegalArgumentException("이미 채팅방에 참여한 유저입니다.");
                }
        );

        ChatRoomUser chatRoomUser = ChatRoomUser
                .builder()
                .chatRoom(room)
                .user(user)
                .build();
        log.info("chatRoomUser: {}", chatRoomUser);

        chatRoomUserRepository.save(chatRoomUser);
    }

    // 채팅방 퇴장
    @MessageMapping("/room/{roomId}/leave")
    public void leaveChatRoom(@DestinationVariable Long roomId, @Payload String data) throws JsonProcessingException {
        ChatRoom room = chatRoomRepository.findById(roomId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 채팅방입니다.")); // 채팅방 조회
        Long userId = Long.valueOf(new ObjectMapper().readTree(data).get("userId").asText());
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다.")); // 유저 조회

        room.getUsers().removeIf(chatRoomUser -> chatRoomUser.getUser().equals(user)); // 해당 유저 삭제

        if (room.getUsers().isEmpty()) {//|| room.getUsers().size() == 1) { // 채팅방에 유저가 0명이거나 1명이면 채팅방 삭제
            chatRoomRepository.delete(room);
        } else {
            chatRoomRepository.save(room);
        }

        ChatMessage message = ChatMessage.builder()
                .message(user.getName() + "님이 퇴장하셨습니다.")
                .timestamp(LocalDateTime.now())
                .userId(user.getUserId())
                .build();
        chatMessageRepository.save(message);
        messagingTemplate.convertAndSend("/pub/room/" + roomId, message);
    }
}
