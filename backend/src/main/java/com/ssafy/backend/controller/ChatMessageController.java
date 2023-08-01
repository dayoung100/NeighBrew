package com.ssafy.backend.controller;

import com.ssafy.backend.entity.ChatMessage;
import com.ssafy.backend.service.ChatMessageService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("/api/chatMessage")
public class ChatMessageController {
    private final ChatMessageService chatMessageService;

    @GetMapping("{chatRoomId}/messages")
    public ResponseEntity<List<ChatMessage>> getChatMessages(@PathVariable Long chatRoomId) {
        Optional<List<ChatMessage>> messages = chatMessageService.getChatMessages(chatRoomId);
        return messages.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
