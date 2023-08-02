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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chatroom")
public class ChatRoomController {
    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatRoomUserRepository chatRoomUserRepository;
    private final ChatMessageRepository chatMessageRepository;


    // 채팅방 생성
    @Transactional
    @PostMapping("/room")
    public ResponseEntity<ChatRoom> createChatRoom(@RequestBody Map<String, Object> map) {
        ChatRoom room = ChatRoom.builder()
                .chatRoomName((String) map.get("name"))
                .build();
        List<Integer> userIdList = (List<Integer>) map.get("userIdList");

        log.info("userIdList: {}", userIdList);
        for (Integer userId : userIdList) {
            User user = userRepository.findById(Long.valueOf(userId)).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다."));
            log.info("user: {}", user);
            ChatRoomUser chatRoomUser = ChatRoomUser.builder()
                    .chatRoom(room)
                    .user(user)
                    .build();
            log.info("chatRoomUser: {}", chatRoomUser);
            chatRoomUserRepository.save(chatRoomUser);
        }

        chatRoomRepository.save(room);
        chatMessageRepository.save(ChatMessage.builder()
                .chatRoom(room)
                .user(null)
                .message("채팅방이 생성되었습니다.")
                .timestamp(LocalDateTime.now())
                .build());
        return ResponseEntity.ok(room);
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
