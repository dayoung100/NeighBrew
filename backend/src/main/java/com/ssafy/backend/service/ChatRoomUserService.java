package com.ssafy.backend.service;

import com.ssafy.backend.entity.ChatRoomUser;
import com.ssafy.backend.repository.ChatRoomRepository;
import com.ssafy.backend.repository.ChatRoomUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatRoomUserService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatRoomUserRepository chatRoomUserRepository;

    public ChatRoomUser save(ChatRoomUser chatRommUser) {
        return chatRoomUserRepository.save(chatRommUser);
    }
}
