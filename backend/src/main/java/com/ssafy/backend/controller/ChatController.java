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
        room.setChatRoomName(name); // 채팅방 이름 설정
        chatRoomRepository.save(room);
        return ResponseEntity.ok(room);
    }

    // 채팅방 입장
    @GetMapping("/rooms/{id}")
    public ResponseEntity<ChatRoom> enterChatRoom(@PathVariable Long id) {
        ChatRoom room = chatRoomRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 채팅방입니다.")); // 채팅방 아이디로 채팅방 찾기
        return ResponseEntity.ok(room);
    }

    // 채팅 메시지 전송
    @PostMapping("/messages")
    public ResponseEntity<ChatMessage> sendMessage(@RequestParam Long roomId, @RequestParam String sender, @RequestParam String message) {
        ChatMessage chatMessage = new ChatMessage();

        chatMessage.setChatRoom(chatRoomRepository.findById(roomId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 채팅방입니다."))); // 채팅방 아이디로 채팅방 찾아서 채팅 메시지에 저장
        chatMessage.setSender(sender);
        chatMessage.setMessage(message);
        chatMessageRepository.save(chatMessage);
        return ResponseEntity.ok(chatMessage);

    }

    // 유저 한명이 채팅방 나가기, 유저가 1명이면 채팅방 삭제
    @DeleteMapping("/rooms/{roomId}/users/{userId}")
    public ResponseEntity<String> exitChatRoom(@PathVariable Long roomId, @PathVariable Long userId) {
        ChatRoom room = chatRoomRepository.findById(roomId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 채팅방입니다."));
        room.getUsers().removeIf(chatRoomUser -> chatRoomUser.getUser().getUserId().equals(userId)); // 채팅방에서 유저 삭제
        if (room.getUsers().size() == 0 || room.getUsers().size() == 1) {// 채팅방에 유저가 1명이면 채팅방 삭제
            chatRoomRepository.delete(room);// 채팅방 삭제
        } else {
            chatRoomRepository.save(room); // 채팅방 정보 업데이트
        }
        return ResponseEntity.ok("success");
    }
}