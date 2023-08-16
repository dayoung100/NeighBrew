package com.ssafy.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.backend.entity.*;
import com.ssafy.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
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
    private final MongoTemplate mongoTemplate;
    private final ChatMessageMongoRepository chatMessageMongoRepository;
    private final ObjectMapper mapper = new ObjectMapper();
    private final ChatDmMessageRepository chatDmMessageRepository;

    public List<ChatRoom> findUserChatRooms(Long userId) {
        return chatRoomUserRepository.findByUser_UserId(userId)
                .stream()
                .map(ChatRoomUser::getChatRoom)
                .collect(Collectors.toList());
    }

    @Transactional
    public ChatRoom createChatRoom(Map<String, Object> map) {
        ChatRoom room = chatRoomRepository.save(ChatRoom
                .builder()
                .chatRoomName((String) map.get("name"))
                .build());
//        chatMessageRepository.save(ChatMessage.builder()
//                .chatRoom(room)
//                .message("채팅방이 생성되었습니다.")
//                .createdAt(LocalDateTime.now())
//                .build());

        chatMessageMongoRepository.save(ChatMessageMongo.builder()
                .chatRoomId(room.getChatRoomId())
                .chatRoomName(room.getChatRoomName())
                .message("채팅방이 생성되었습니다.")
                .createdAt(String.valueOf(LocalDateTime.now()))
                .build());

        ((List<Integer>) map.get("userIdList")).forEach(userId -> chatRoomUserRepository.save(ChatRoomUser.builder()
                .chatRoom(room)
                .user(userRepository.findById(Long.valueOf(userId)).orElseThrow(
                        () -> new IllegalArgumentException("존재하지 않는 유저입니다.")))
                .build()));
        return room;
    }

    public String sendMessage(Long roomId, String data) throws JsonProcessingException {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 채팅방입니다."));
        JsonNode jsonNode = mapper.readTree(data);
        User user = userRepository.findById(jsonNode.get("userId").asLong()).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다."));
        if (chatRoomUserRepository.findByChatRoomAndUser_UserId(chatRoom, jsonNode.get("userId").asLong()).isEmpty())
            throw new IllegalArgumentException("채팅방에 참여하지 않은 유저입니다.");

        ChatMessageMongo chatMessageMongo = ChatMessageMongo.builder()
                .chatRoomId(chatRoom.getChatRoomId())
                .chatRoomName(chatRoom.getChatRoomName())
                .message(jsonNode.get("message").asText())
                .userId(user.getUserId())
                .userNickname(user.getNickname())
                .createdAt(String.valueOf(LocalDateTime.now()))
                .build();
        mongoTemplate.insert(chatMessageMongo);
        Map<String, Object> map = mapper.convertValue(jsonNode, Map.class);
        map.put("userNickname", user.getNickname());
        return mapper.writeValueAsString(map);
    }

    public String leaveChatRoom(Long roomId, String data) throws JsonProcessingException {
        ChatRoom room = chatRoomRepository.findById(roomId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 채팅방입니다."));
        Long userId = Long.valueOf(new ObjectMapper().readTree(data).get("userId").asText());
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다."));
        chatRoomUserRepository.deleteByUser_UserIdAndChatRoom_ChatRoomId(userId, roomId);

        if (room.getUsers().isEmpty()) chatRoomRepository.delete(room);


        return mapper.writeValueAsString(mongoTemplate.insert(ChatMessageMongo.builder()
                .userId(userId)
                .userNickname(user.getNickname())
                .message(user.getNickname() + "님이 채팅방을 나갔습니다.")
                .chatRoomId(roomId)
                .chatRoomName(room.getChatRoomName())
                .createdAt(String.valueOf(LocalDateTime.now()))
                .build()
        ));
    }

    public List<User> getUsersInChatRoom(Long chatRoomId) {
        return chatRoomRepository
                .findById(chatRoomId)
                .orElseThrow(
                        () -> new IllegalArgumentException("존재하지 않는 채팅방입니다."))
                .getUsers()
                .stream()
                .map(ChatRoomUser::getUser)
                .collect(Collectors.toList());
    }

    public void deleteExistUser(ChatRoom chatRoom, Long userId) {
        chatRoomUserRepository.deleteByUser_UserIdAndChatRoom_ChatRoomId(userId, chatRoom.getChatRoomId());
        User findUser = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다."));
        if (chatRoom.getUsers().isEmpty()) chatRoomRepository.delete(chatRoom);
        mongoTemplate.insert(ChatMessageMongo.builder()
                .userId(userId)
                .userNickname(findUser.getNickname())
                .message(findUser.getNickname() + "님이 채팅방을 나갔습니다.")
                .chatRoomId(chatRoom.getChatRoomId())
                .chatRoomName(chatRoom.getChatRoomName())
                .createdAt(String.valueOf(LocalDateTime.now()))
                .build()
        );
    }
}
