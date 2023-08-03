package com.ssafy.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
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
    private final ObjectMapper mapper = new ObjectMapper();

    public List<ChatRoom> findUserChatRooms(Long userId) {
        return chatRoomUserRepository.findByUser_UserId(userId)
                .stream()
                .map(ChatRoomUser::getChatRoom)
                .collect(Collectors.toList());
    }

    @Transactional
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

    public String sendMessage(Long roomId, String data) throws JsonProcessingException {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 채팅방입니다."));
        JsonNode jsonNode = mapper.readTree(data);
        User user = userRepository.findById(jsonNode.get("userId").asLong()).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다."));
        Map<String, Object> map = mapper.convertValue(jsonNode, Map.class);
        map.put("userNickname", user.getNickname());

        if (chatRoomUserRepository.findByChatRoomAndUser_UserId(chatRoom, jsonNode.get("userId").asLong()).isEmpty()) {
            throw new IllegalArgumentException("채팅방에 참여하지 않은 유저입니다.");
        }

        ChatMessage chatMessage = ChatMessage.builder()
                .chatRoom(chatRoom)
                .message(jsonNode.get("message").asText())
                .user(user)
                .timestamp(LocalDateTime.now())
                .build();

        chatMessageRepository.save(chatMessage);
        return mapper.writeValueAsString(map);
    }

    public String leaveChatRoom(Long roomId, String data) throws JsonProcessingException {
        ChatRoom room = chatRoomRepository.findById(roomId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 채팅방입니다."));
        Long userId = Long.valueOf(new ObjectMapper().readTree(data).get("userId").asText());
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다."));

        chatRoomUserRepository.deleteByUser_UserIdAndChatRoom_ChatRoomId(userId, roomId);
        chatRoomUserRepository.flush();

        if (room.getUsers().isEmpty())
            chatRoomRepository.delete(room);

        ChatMessage message = ChatMessage.builder()
                .message(user.getNickname() + "님이 채팅방을 나갔습니다.")
                .timestamp(LocalDateTime.now())
                .user(user)
                .build();
        chatMessageRepository.save(message);
        return new ObjectMapper().writeValueAsString(message);
    }

    public List<User> getUsersInChatRoom(Long chatRoomId) {
        return chatRoomRepository
                .findById(chatRoomId)
                .orElseThrow(()
                        -> new IllegalArgumentException("존재하지 않는 채팅방입니다."))
                .getUsers()
                .stream()
                .map(ChatRoomUser::getUser)
                .collect(Collectors.toList());
    }


    public ChatRoom save(ChatRoom chatRoom) {
        return chatRoomRepository.save(chatRoom);
    }

    public void deleteExistUser(ChatRoom chatRoom, Long userId) {
        chatRoomUserRepository.deleteByUser_UserIdAndChatRoom_ChatRoomId(userId, chatRoom.getChatRoomId());
        chatRoomUserRepository.flush();

        User findUser = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다."));

        if (chatRoom.getUsers().isEmpty())
            chatRoomRepository.delete(chatRoom);

        ChatMessage message = ChatMessage.builder()
                .message(findUser.getNickname() + "님이 채팅방을 나갔습니다.")
                .timestamp(LocalDateTime.now())
                .user(findUser)
                .build();
        chatMessageRepository.save(message);
    }
}
