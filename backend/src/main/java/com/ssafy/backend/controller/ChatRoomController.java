package com.ssafy.backend.controller;

import com.ssafy.backend.entity.ChatRoom;
import com.ssafy.backend.service.ChatRoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chatroom")
public class ChatRoomController {
    private final ChatRoomService chatRoomService;

    // 채팅방 생성
    @PostMapping("/room")
    public ResponseEntity<ChatRoom> createChatRoom(@RequestBody Map<String, Object> map) {
        return ResponseEntity.ok(chatRoomService.createChatRoom(map));
    }

    // 유저 아이디로 채팅방 조회
    @GetMapping("/{userId}/getChatRoom")
    public ResponseEntity<?> getUserChatRooms(@PathVariable Long userId) {
        return ResponseEntity.ok(chatRoomService.findUserChatRooms(userId));
    }

    // 채팅방 유저 조회
    @GetMapping("/{chatRoomId}/users")
    public ResponseEntity<?> getChatRoomUsers(@PathVariable Long chatRoomId) {
        return ResponseEntity.ok(chatRoomService.getUsersInChatRoom(chatRoomId));
    }
}
