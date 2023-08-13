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

@Service
@Slf4j
@RequiredArgsConstructor
public class ChatDmService {
    private final ChatDmMessageRepository chatDmMessageRepository;
    private final ChatDmRoomRepository chatDmRoomRepository;
    private final UserRepository userRepository;
    private final PushService pushService;
    private final ObjectMapper mapper = new ObjectMapper();

    @Value("${neighbrew.url}")
    private String neighbrewUrl;

    //DM 목록 조회
    public List<ChatDmRoom> findMyDmList(Long userId) {
        List<ChatDmRoom> dmList = chatDmRoomRepository.findChatDmRoomByIdOOrderByLastMessageTimeDesc(userId).orElseThrow(() -> new IllegalArgumentException("유저 정보가 올바르지 않습니다."));

        List<ChatDmRoom> result = new ArrayList<>();
        for (ChatDmRoom cdr : dmList) {
            //떠난 기록이 있을 경우 내 목록에서 제외한다.
            if (cdr.getUser1().getUserId() == userId) {
                if (cdr.getUser1AttendTime() != null) result.add(cdr);
            } else if (cdr.getUser2().getUserId() == userId) {
                if (cdr.getUser2AttendTime() != null) result.add(cdr);
            }
        }

        return result;
    }

    public Map<String, Object> findDmMessagesByRoomId(Long requestUser, Long user1Id, Long user2Id) {
        Map<String, Object> result = new HashMap<>();
        log.info("{}와{}의 메세지 가져오기", user1Id, user2Id);

        Optional<ChatDmRoom> dmRoom = chatDmRoomRepository.findByUser1_UserIdAndUser2_UserId(user1Id, user2Id);
        LocalDateTime currentTime = LocalDateTime.now();
        if (dmRoom.isPresent()) {
            if (requestUser.equals(user1Id)) {
                result.put("messages", chatDmMessageRepository.findByChatDmRoom_ChatDmRoomIdAndCreatedAtBetween(dmRoom.get().getChatDmRoomId(), dmRoom.get().getUser1AttendTime(), currentTime));
            } else {
                result.put("messages", chatDmMessageRepository.findByChatDmRoom_ChatDmRoomIdAndCreatedAtBetween(dmRoom.get().getChatDmRoomId(), dmRoom.get().getUser2AttendTime(), currentTime));
            }
        } else {
            //방이 없으면 빈 배열을 전달한다.
            result.put("messages", new ArrayList<>());
        }

        result.put("user1", UserResponseDto.fromEntity(userRepository.findById(user1Id).orElseThrow(
                () -> new IllegalArgumentException("user1이 존재하지 않습니다.")
        )));
        result.put("user2", UserResponseDto.fromEntity(userRepository.findById(user2Id).orElseThrow(
                () -> new IllegalArgumentException("user2가 존재하지 않습니다.")
        )));
        return result;
    }


    // 공통 로직
    @Transactional
    public Map<String, Object> createChatOrSend(Long user1Id,
                                                Long user2Id,
                                                String payload) throws JsonProcessingException {
        //클라이언트에서 보낸 메세지 데이터 파싱
        JsonNode jsonNode = mapper.readTree(payload);
        String message = jsonNode.get("message").asText();
        Long senderId = jsonNode.get("senderId").asLong();
        String userNickName = String.valueOf(jsonNode.get("nickname"));

        log.info("메세지 데이터 파싱 결과 : {}, {}, {}", message, userNickName, senderId);
        User user1 = userRepository.findById(user1Id)
                .orElseThrow(() -> new IllegalArgumentException("user1 does not exist."));
        User user2 = userRepository.findById(user2Id)
                .orElseThrow(() -> new IllegalArgumentException("user2 does not exist."));

        Optional<ChatDmRoom> chatDmRoomOptional = chatDmRoomRepository.findDmUsers(user1, user2);

        //방이 있으면 가져오고 없으면 생성한다.
        ChatDmRoom chatDmRoom = chatDmRoomOptional.orElseGet(() -> chatDmRoomRepository.save(ChatDmRoom.builder()
                .user1(user1)
                .user2(user2)
                .build()));

        //작성자가 누구인지에 따라 다르게 동작을 수행시킨다.
        if (senderId == user1Id) return saveMessageAndPush(chatDmRoom, user1, user2, message);
        else return saveMessageAndPush(chatDmRoom, user2, user1, message);
    }

    @Transactional
    public String leaveDm(Long user1Id, Long user2Id, String payload) throws JsonProcessingException {
        //데이터를 파싱한다.
        JsonNode jsonNode = mapper.readTree(payload);
        Long leaveUserId = jsonNode.get("leaveUserId").asLong();

        ChatDmRoom findDmRoom = chatDmRoomRepository.findByUser1_UserIdAndUser2_UserId(user1Id, user2Id).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 채팅방 입니다."));

        User leaveUser = userRepository.findByUserId(leaveUserId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저 입니다."));

        Map<String, Object> result = new HashMap<>();
        if ((leaveUserId == user1Id && findDmRoom.getUser2AttendTime() == null)
                || (leaveUserId == user2Id && findDmRoom.getUser1AttendTime() == null)) {
            log.info("dmRoom과 Message 전부 제거합니다.");

            //DM 채팅방에 해당하는 모든 Message 삭제
            chatDmMessageRepository.deleteByChatDmRoom_ChatDmRoomId(findDmRoom.getChatDmRoomId());
            // DM 테이블 제거
            chatDmRoomRepository.deleteById(findDmRoom.getChatDmRoomId());
            //둘 다 나가면 반환 되는 메세지는 없다.
            result.put("message", "모든 유저가 채팅방을 떠났습니다. 채팅을 종료합니다.");
            return mapper.writeValueAsString(result);
        }

        //나가려는 유저의 attendTime을 null로 변경한다.
        if (user1Id.equals(leaveUserId)) findDmRoom.setUser1AttendTime(null);
        else if (user2Id.equals(leaveUserId)) findDmRoom.setUser2AttendTime(null);
        chatDmRoomRepository.save(findDmRoom);

        //시스템 메세지를 저장
        chatDmMessageRepository.save(ChatDmMessage.builder()
                .chatDmRoom(findDmRoom)
                .user(leaveUser)
                .message(leaveUser.getNickname() + "님이 채팅방을 나갔습니다.")
                .createdAt(LocalDateTime.now())
                .build());

        //채팅방을 나갔다는 메세지를 전송한다.
        result.put("message", leaveUser.getNickname() + "님이 채팅방을 나갔습니다.");
        result.put("userId", leaveUserId);
        result.put("user", UserResponseDto.fromEntity(leaveUser));

        return mapper.writeValueAsString(result);
    }

    @Transactional
    public Map<String, Object> saveMessageAndPush(ChatDmRoom chatDmRoom, User sender, User receiver, String message) {

        LocalDateTime currentTime = LocalDateTime.now();
        //작성자 ID == DM.User1
        if (sender.getUserId() == chatDmRoom.getUser1().getUserId()) {
            //작성자 user1의 참여시간이 null -> 방을 퇴장했으니. 참여로 전환한다.
            if (chatDmRoom.getUser1AttendTime() == null) {
                chatDmRoom.setUser1AttendTime(currentTime);

            }//작성자는 user1인데 유저2가 퇴장한 상태
            else if (chatDmRoom.getUser2AttendTime() == null) {
                chatDmRoom.setUser2AttendTime(currentTime); //유저1의 참여 상태로 전환해 메세지를 받게 한다.
            }
        }//작성자 ID == DM.user2
        else if (sender.getUserId() == chatDmRoom.getUser2().getUserId()) {
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
