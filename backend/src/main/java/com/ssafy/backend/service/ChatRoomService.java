package com.ssafy.backend.service;

import com.ssafy.backend.entity.ChatMessage;
import com.ssafy.backend.entity.ChatRoom;
import com.ssafy.backend.entity.ChatRoomUser;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.ChatMessageRepository;
import com.ssafy.backend.repository.ChatRoomRepository;
import com.ssafy.backend.repository.ChatRoomUserRepository;
import com.ssafy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatRoomService {
    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatRoomUserRepository chatRoomUserRepository;
    private final UserRepository userRepository;


    public List<ChatRoom> findUserChatRooms(Long userId) {
        return chatRoomUserRepository.findByUser_UserId(userId)
                .stream()
                .map(ChatRoomUser::getChatRoom)
                .collect(Collectors.toList());
    }

    public ChatRoom createChatRoom(Map<String, Object> map) {
        ChatRoom room = ChatRoom.builder()
                .chatRoomName((String) map.get("name"))
                .build();

        List<Integer> userIdList = (List<Integer>) map.get("userIdList");

        for (Integer userId : userIdList) {
            User user = userRepository.findById(Long.valueOf(userId)).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다."));
            ChatRoomUser chatRoomUser = ChatRoomUser.builder()
                    .chatRoom(room)
                    .user(user)
                    .build();

            chatRoomUserRepository.save(chatRoomUser);
        }

        chatRoomRepository.save(room);
        chatMessageRepository.save(ChatMessage.builder()
                .chatRoom(room)
                .user(null)
                .message("채팅방이 생성되었습니다.")
                .timestamp(LocalDateTime.now())
                .build());

        return room;
    }
}
