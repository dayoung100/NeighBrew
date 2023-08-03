package com.ssafy.backend.service;

import com.ssafy.backend.entity.ChatMessage;
import com.ssafy.backend.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChatMessageService {
    @Autowired
    private ChatMessageRepository chatMessageRepository;

    public Optional<List<ChatMessage>> getChatMessages(Long chatRoomId) {
        return Optional.ofNullable(chatMessageRepository.findByChatRoom_ChatRoomIdOrderByTimestamp(chatRoomId));
    }

    public void save(ChatMessage chatMessage) {
        chatMessageRepository.save(chatMessage);
    }
}
