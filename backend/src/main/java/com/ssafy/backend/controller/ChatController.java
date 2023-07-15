package com.ssafy.backend.controller;

import com.ssafy.backend.entity.ChatMessage;
import com.ssafy.backend.entity.ChatRoom;
import com.ssafy.backend.repository.ChatMessageRepository;
import com.ssafy.backend.repository.ChatRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    // 채팅방 목록 조회
    @GetMapping("/rooms")
    public ResponseEntity<List<ChatRoom>> getChatRooms() {
        List<ChatRoom> rooms = chatRoomRepository.findAll();
        return ResponseEntity.ok(rooms);
    }

    // 채팅방 생성
    @PostMapping("/rooms")
    public ResponseEntity<ChatRoom> createChatRoom(@RequestParam String name) {
        ChatRoom room = new ChatRoom();
        room.setChatRoomName(name);
        chatRoomRepository.save(room);
        return ResponseEntity.ok(room);
    }

    // 채팅방 입장
    @GetMapping("/rooms/{id}")
    public ResponseEntity<ChatRoom> enterChatRoom(@PathVariable Long id) {
        ChatRoom room = chatRoomRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 채팅방입니다."));
        return ResponseEntity.ok(room);
    }

    // 채팅 메시지 전송
    @PostMapping("/messages")
    public ResponseEntity<ChatMessage> sendMessage(@RequestParam Long roomId, @RequestParam String sender, @RequestParam String message) {
        ChatMessage chatMessage = new ChatMessage();

        chatMessage.setChatRoom(chatRoomRepository.findById(roomId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 채팅방입니다.")));
        chatMessage.setSender(sender);
        chatMessage.setMessage(message);
        chatMessageRepository.save(chatMessage);
        return ResponseEntity.ok(chatMessage);

    }

    // 유저 한명이 채팅방 나가기
    @DeleteMapping("/rooms/{roomId}/users/{userId}")
    public ResponseEntity<ChatRoom> exitChatRoom(@PathVariable Long roomId, @PathVariable Long userId) {
        ChatRoom room = chatRoomRepository.findById(roomId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 채팅방입니다."));
        room.getUsers().removeIf(chatRoomUser -> chatRoomUser.getUser().getUserId().equals(userId));
        chatRoomRepository.save(room);
        return ResponseEntity.ok(room);
    }
}