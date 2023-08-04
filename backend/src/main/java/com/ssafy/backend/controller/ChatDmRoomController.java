package com.ssafy.backend.controller;

import com.ssafy.backend.service.ChatDmRoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/dm-room")
public class ChatDmRoomController {
    private final ChatDmRoomService chatDmRoomService;

    // 유저 아이디로 DM목록 조회
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserDmRooms(@PathVariable Long userId) {
        return ResponseEntity.ok(chatDmRoomService.findChatDmRoomsByUserId(userId));
    }


}
