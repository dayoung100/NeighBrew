package com.ssafy.backend.service;


import com.ssafy.backend.entity.ChatDmMessage;
import com.ssafy.backend.repository.ChatDmMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatDmMessageService {
    private final ChatDmMessageRepository chatDmMessageRepository;

    public ChatDmMessage save(ChatDmMessage chatDmMessage) {
        return chatDmMessageRepository.save(chatDmMessage);
    }

    @Transactional
    public void deleteAllMessage(Long dmRoomId) {
        chatDmMessageRepository.deleteByChatDmRoom_ChatDmRoomId(dmRoomId);
    }

    public List<ChatDmMessage> findDmMessagesByRoomId(Long senderId, Long receiverId) {
        return chatDmMessageRepository.findByChatDmRoom_ChatDmRoomId(senderId, receiverId).orElseThrow(()-> new IllegalArgumentException("채팅방 정보가 올바르지 않습니다."));
    }
}
