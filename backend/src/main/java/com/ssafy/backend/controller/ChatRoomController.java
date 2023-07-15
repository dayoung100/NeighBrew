package com.ssafy.backend.controller;

import com.ssafy.backend.entity.ChatMessage;
import com.ssafy.backend.entity.ChatRoom;
import com.ssafy.backend.entity.ChatRoomUser;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.ChatRoomRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatRoomController {

    private final ChatRoomRepository chatRoomRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatRoomController(ChatRoomRepository chatRoomRepository, SimpMessagingTemplate messagingTemplate) {
        this.chatRoomRepository = chatRoomRepository;
        this.messagingTemplate = messagingTemplate;
    }

    // 채팅방 생성
    @PostMapping("/room")
    public ResponseEntity<ChatRoom> createChatRoom(@RequestBody Map<String, String> map) {
        ChatRoom room = new ChatRoom();
        room.setChatRoomName(map.get("name"));
        chatRoomRepository.save(room);
        return ResponseEntity.ok(room);
    }


    // 채팅방 입장 (채팅방에 유저 추가)
    @MessageMapping("/room/{roomId}/join")
    public void joinChatRoom(@DestinationVariable Long roomId, @Payload User user) {
        ChatRoom room = chatRoomRepository.findById(roomId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 채팅방입니다."));

        ChatRoomUser chatRoomUser = new ChatRoomUser(); // 채팅방 유저 생성
        chatRoomUser.setChatRoom(room);
        chatRoomUser.setUser(user);
        room.getUsers().add(chatRoomUser);

        chatRoomRepository.save(room); // 채팅방 저장

        ChatMessage message = new ChatMessage(); // 입장 메시지 생성
        message.setSender("알림");
        message.setMessage(user.getName() + "님이 입장하셨습니다.");
        message.setTimestamp(LocalDateTime.now());
        messagingTemplate.convertAndSend("/pub/room/" + roomId, message); // 채팅방 구독자들에게 입장 메시지 전송
    }

    // 채팅방 퇴장
    @MessageMapping("/room/{roomId}/leave")
    public void leaveChatRoom(@DestinationVariable Long roomId, @Payload User user) {
        ChatRoom room = chatRoomRepository.findById(roomId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 채팅방입니다.")); // 채팅방 조회

        room.getUsers().removeIf(chatRoomUser -> chatRoomUser.getUser().equals(user)); // 해당 유저 삭제

        if (room.getUsers().size() == 0 || room.getUsers().size() == 1) { // 채팅방에 유저가 0명이거나 1명이면 채팅방 삭제
            chatRoomRepository.delete(room);
        } else {
            chatRoomRepository.save(room);
        }

        ChatMessage message = new ChatMessage(); // 채팅방에 퇴장 메시지 전송
        message.setSender("알림");
        message.setMessage(user.getName() + "님이 퇴장하셨습니다."); // 채팅방에 퇴장 메시지 전송
        message.setTimestamp(LocalDateTime.now());
        messagingTemplate.convertAndSend("/pub/room/" + roomId, message);
    }
}
