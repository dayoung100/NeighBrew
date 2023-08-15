package com.ssafy.backend.controller;

import com.ssafy.backend.entity.ChatMessage;
import com.ssafy.backend.service.ChatMessageService;
import com.ssafy.backend.util.JwtUtil;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("/api/chatMessage")
public class ChatMessageController {
    private final ChatMessageService chatMessageService;

    //단체 채팅방 메세지 가져온다.
    @GetMapping("{chatRoomId}/{userId}/messages")
    public ResponseEntity<List<ChatMessage>> getChatMessages(@PathVariable Long chatRoomId,
                                                             @PathVariable Long userId,
                                                             @RequestHeader("Authorization") String token) {
        JwtUtil.validateToken(token, userId);
        Optional<List<ChatMessage>> messages = chatMessageService.getChatMessages(chatRoomId);
        return messages.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
