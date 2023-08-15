package com.ssafy.backend.service;

import com.ssafy.backend.entity.ChatMessage;
import com.ssafy.backend.entity.Mongo;
import com.ssafy.backend.repository.ChatMessageRepository;
import com.ssafy.backend.repository.MongoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final MongoRepository mongoRepository;

    public List<Mongo> getChatMessages(Long chatRoomId) {
        return mongoRepository.findByChatRoomIdOrderByCreatedAt(chatRoomId);
    }

    public void save(ChatMessage chatMessage) {
        chatMessageRepository.save(chatMessage);
    }
}
