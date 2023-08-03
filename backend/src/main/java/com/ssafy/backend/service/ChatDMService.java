package com.ssafy.backend.service;

import com.ssafy.backend.entity.ChatDM;
import com.ssafy.backend.repository.ChatDMRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChatDMService {
    private ChatDMRepository chatDMRepository;

//    public Map<String, Object> sendChatMessageOneToOne(Long senderId, Long receiverId, String data) {
//        ChatDM chatDM = chatDMRepository.findByUser1_UserIdAndUser2_UserId()
//    }
}
