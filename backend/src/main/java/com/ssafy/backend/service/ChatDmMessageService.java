package com.ssafy.backend.service;


import com.ssafy.backend.entity.ChatDmMessage;
import com.ssafy.backend.repository.ChatDmMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatDmMessageService {
    private final ChatDmMessageRepository chatDmMessageRepository;

    public ChatDmMessage save(ChatDmMessage chatDmMessage) {
        return chatDmMessageRepository.save(chatDmMessage);
    }

    public void deleteAllMessage(Long dmRoomId) {
    }

    public List<ChatDmMessage> findDmMessagesByRoomId(Long dmRoomId) {
        return null;
    }
}
