package com.ssafy.backend.service;

import com.ssafy.backend.entity.ChatMessage;
import com.ssafy.backend.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;

    public Optional<List<ChatMessage>> getChatMessages(Long chatRoomId) {
        return Optional.ofNullable(chatMessageRepository.findByChatRoom_ChatRoomIdOrderByCreatedAt(chatRoomId));
    }

    public void save(ChatMessage chatMessage) {
        chatMessageRepository.save(chatMessage);
    }
}
