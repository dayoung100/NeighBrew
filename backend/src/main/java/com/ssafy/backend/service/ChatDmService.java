package com.ssafy.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.backend.dto.user.UserResponseDto;
import com.ssafy.backend.entity.ChatDmMessage;
import com.ssafy.backend.entity.ChatDmRoom;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.ChatDmMessageRepository;
import com.ssafy.backend.repository.ChatDmRoomRepository;
import com.ssafy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ChatDmService {
    private final ChatDmMessageRepository chatDmMessageRepository;
    private final ChatDmRoomRepository chatDmRoomRepository;
    private final UserRepository userRepository;
    private final ObjectMapper mapper = new ObjectMapper();

    @Value("${neighbrew.url}")
    private String neighbrewUrl;

    //DM 목록 조회
    public List<ChatDmRoom> findMyDmList(Long userId) {
        return chatDmRoomRepository.findChatDmRoomByIdOrderByLastMessageTimeDesc(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저 정보가 올바르지 않습니다."))
                .stream()
                .filter(cdr -> (cdr.getUser1().getUserId().equals(userId) && cdr.getUser1AttendTime() != null)
                        || (cdr.getUser2().getUserId().equals(userId) && cdr.getUser2AttendTime() != null))
                .collect(Collectors.toList());
    }

    public Map<String, Object> findDmMessagesByRoomId(Long requestUser, Long user1Id, Long user2Id) {
        Map<String, Object> result = new HashMap<>();

        chatDmRoomRepository.findByUser1_UserIdAndUser2_UserId(user1Id, user2Id).ifPresent(dmRoom -> {
            LocalDateTime currentTime = LocalDateTime.now();
            List<ChatDmMessage> messages = (requestUser.equals(user1Id))
                    ? chatDmMessageRepository.findByChatDmRoom_ChatDmRoomIdAndCreatedAtBetween(dmRoom.getChatDmRoomId(), dmRoom.getUser1AttendTime(), currentTime)
                    : chatDmMessageRepository.findByChatDmRoom_ChatDmRoomIdAndCreatedAtBetween(dmRoom.getChatDmRoomId(), dmRoom.getUser2AttendTime(), currentTime);
            result.put("messages", messages);
        });

        result.put("user1", getUserResponseDto(user1Id, "user1이 존재하지 않습니다."));
        result.put("user2", getUserResponseDto(user2Id, "user2가 존재하지 않습니다."));

        return result;
    }

    private UserResponseDto getUserResponseDto(Long userId, String errorMessage) {
        return userRepository.findById(userId)
                .map(UserResponseDto::fromEntity)
                .orElseThrow(() -> new IllegalArgumentException(errorMessage));
    }

    // 공통 로직
    @Transactional
    public Map<String, Object> createChatOrSend(Long user1Id, Long user2Id, String payload) throws JsonProcessingException {
        JsonNode jsonNode = mapper.readTree(payload);

        String message = jsonNode.get("message").asText();
        Long senderId = jsonNode.get("senderId").asLong();

        User user1 = getUserOrThrow(user1Id, "user1은 존재하지 않습니다.");
        User user2 = getUserOrThrow(user2Id, "user2는 존재하지 않습니다.");

        ChatDmRoom chatDmRoom = chatDmRoomRepository.findDmUsers(user1, user2)
                .orElseGet(() -> chatDmRoomRepository.save(new ChatDmRoom(user1, user2)));

        return (senderId.equals(user1Id))
                ? saveMessageAndPush(chatDmRoom, user1, message)
                : saveMessageAndPush(chatDmRoom, user2, message);
    }

    private User getUserOrThrow(Long userId, String errorMessage) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException(errorMessage));
    }

    @Transactional
    public String leaveDm(Long user1Id, Long user2Id, String payload) throws JsonProcessingException {
        JsonNode jsonNode = mapper.readTree(payload);
        Long leaveUserId = jsonNode.get("leaveUserId").asLong();
        User leaveUser = getUserOrThrow(leaveUserId, "존재하지 않는 유저 입니다.");

        ChatDmRoom findDmRoom = chatDmRoomRepository.findByUser1_UserIdAndUser2_UserId(user1Id, user2Id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 채팅방 입니다."));

        if ((user1Id.equals(leaveUserId) && findDmRoom.getUser2AttendTime() == null)
                || (user2Id.equals(leaveUserId) && findDmRoom.getUser1AttendTime() == null)) {

            chatDmMessageRepository.deleteByChatDmRoom_ChatDmRoomId(findDmRoom.getChatDmRoomId());
            chatDmRoomRepository.deleteById(findDmRoom.getChatDmRoomId());
            return mapper.writeValueAsString(Collections.singletonMap("message", "모든 유저가 채팅방을 떠났습니다. 채팅을 종료합니다."));
        }

        if (user1Id.equals(leaveUserId)) {
            findDmRoom.setUser1AttendTime(null);
        } else if (user2Id.equals(leaveUserId)) {
            findDmRoom.setUser2AttendTime(null);
        }

        chatDmRoomRepository.save(findDmRoom);

        String leaveMessage = getUserOrThrow(leaveUserId, "존재하지 않는 유저 입니다.").getNickname() + "님이 채팅방을 나갔습니다.";
        chatDmMessageRepository.save(ChatDmMessage.builder()
                .chatDmRoom(findDmRoom)
                .user(leaveUser)
                .message(leaveUser.getNickname() + "님이 채팅방을 나갔습니다.")
                .createdAt(LocalDateTime.now())
                .build());

        Map<String, Object> result = new HashMap<>();
        result.put("message", leaveMessage);
        result.put("userId", leaveUserId);
        result.put("user", UserResponseDto.fromEntity(getUserOrThrow(leaveUserId, "존재하지 않는 유저 입니다.")));
        return mapper.writeValueAsString(result);
    }

    @Transactional
    public Map<String, Object> saveMessageAndPush(ChatDmRoom chatDmRoom, User sender, String message) {
        LocalDateTime currentTime = LocalDateTime.now();
        //작성자 ID == DM.User1
        if (Objects.equals(sender.getUserId(), chatDmRoom.getUser1().getUserId())) {
            if (chatDmRoom.getUser1AttendTime() == null) {
                chatDmRoom.setUser1AttendTime(currentTime);

            }//작성자는 user1인데 유저2가 퇴장한 상태
            else if (chatDmRoom.getUser2AttendTime() == null) {
                chatDmRoom.setUser2AttendTime(currentTime); //유저1의 참여 상태로 전환해 메세지를 받게 한다.
            }
        }//작성자 ID == DM.user2
        else if (Objects.equals(sender.getUserId(), chatDmRoom.getUser2().getUserId())) {
            //작성자 user2의 참여시간이 null -> 방을 퇴장했으니. 참여로 전환한다.
            if (chatDmRoom.getUser2AttendTime() == null) {
                chatDmRoom.setUser2AttendTime(currentTime);
            } else if (chatDmRoom.getUser1AttendTime() == null) {
                chatDmRoom.setUser1AttendTime(currentTime); //유저1의 참여 상태로 전환해 메세지를 받게 한다.
            }
        }
        //메세지가 올 떄 마다 업데이트를 수행한다.
        chatDmRoom.setLastMessageTime(currentTime);

        chatDmRoomRepository.save(chatDmRoom);

        //채팅 메세지를 저장
        chatDmMessageRepository.save(ChatDmMessage.builder()
                .chatDmRoom(chatDmRoom)
                .user(sender)
                .message(message)
                .createdAt(LocalDateTime.now())
                .build());

        //받은 메세지 내용은 그대로 돌려준다
        Map<String, Object> result = new HashMap<>();
        result.put("message", message);
        result.put("userId", sender.getUserId());
        result.put("user", UserResponseDto.fromEntity(sender));

        /* 채팅에 대한 Push알림은 잠시 막겠습니다.
        //PushService.send(User sender, User receiver, PushType pushType, String content, String url)
        String pushContent = sender.getNickname() + "님께서 메세지를 보내셨습니다.\n" + message;
        StringBuilder moveUrl = new StringBuilder();
        moveUrl.append("https://").append(neighbrewUrl).append("/directchat")
                .append("/" + sender.getUserId())
                .append("/" + receiver.getUserId());
        pushService.send(sender, receiver, PushType.CHAT, pushContent, moveUrl.toString());
        */
        return result;
    }
}
