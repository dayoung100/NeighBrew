package com.ssafy.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.backend.Enum.PushType;
import com.ssafy.backend.dto.UserDto;
import com.ssafy.backend.entity.ChatDmMessage;
import com.ssafy.backend.entity.ChatDmRoom;
import com.ssafy.backend.entity.ChatMessage;
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

    //public Map<String, Object> findChatDmRoomsByUserId(Long userId) {
        //Map<String, Object> result = new HashMap<>();
    public List<ChatDmRoom> findChatDmRoomsByUserId(Long userId) {
        List<ChatDmRoom> dmList =  chatDmRoomRepository.findChatDmRoomById(userId).orElseThrow(() -> new IllegalArgumentException("유저 정보가 올바르지 않습니다."));

        return dmList;
    }
    public Map<String, Object>  findDmMessagesByRoomId(Long user1Id, Long user2Id) {
        Map<String, Object> result = new HashMap<>();
        log.info("{}와{}의 메세지 가져오기", user1Id, user2Id);

        Optional<ChatDmRoom> dmRoom = chatDmRoomRepository.findByUser1_UserIdAndUser2_UserId(user1Id, user2Id);
        if(dmRoom.isPresent()){
            result.put("messages", chatDmMessageRepository.findByChatDmRoom_ChatDmRoomId(dmRoom.get().getChatDmRoomId()).orElseThrow(()-> new IllegalArgumentException("채팅방 정보가 올바르지 않습니다.")));
        }else {
            result.put("messages", new ArrayList<>());
        }
        result.put("user1", userRepository.findById(user1Id));
        result.put("user2", userRepository.findById(user2Id));
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
        String userNickName = String.valueOf(jsonNode.get("userNickname"));

        log.info("메세지 데이터 파싱 결과 : {}, {}, {}", message, userNickName, senderId);
        User user1 = userRepository.findById(user1Id)
                .orElseThrow(() -> new IllegalArgumentException("user1 does not exist."));
        User user2 = userRepository.findById(user2Id)
                .orElseThrow(() -> new IllegalArgumentException("user2 does not exist."));

        Optional<ChatDmRoom> chatDmRoomOptional = chatDmRoomRepository.findDmUsers(user1, user2);
        ChatDmRoom chatDmRoom;

        //방이 있으면 받아온다. user1Id < user2Id는 무조건임
        chatDmRoom = chatDmRoomOptional.orElseGet(() -> chatDmRoomRepository.save(ChatDmRoom.builder()
                .user1(user1)
                .user2(user2)
                .build()));

        //작성자가 누구인지에 따라 다르게 동작을 수행시킨다.
        if(senderId == user1Id) return saveMessageAndPush(chatDmRoom, user1, user2, message);
        else return saveMessageAndPush(chatDmRoom, user2, user1, message);
    }

    @Transactional
    public String leaveDm(Long user1Id, Long user2Id, String payload) throws JsonProcessingException {
        //데이터를 파싱한다.
        JsonNode jsonNode = mapper.readTree(payload);
        Long leaveUserId = jsonNode.get("leaveUserId").asLong();

        ChatDmRoom findDmRoom = chatDmRoomRepository.findByUser1_UserIdAndUser2_UserId(user1Id, user2Id).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 채팅방 입니다."));
        User leaveUser = userRepository.findByUserId(leaveUserId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저 입니다."));

        //유저 정보가 채팅방에 유저가 1명 남은 상태에서 다시 접근하면 모든 데이터를 지운다.
        if (findDmRoom.getUser1() == null || findDmRoom.getUser2() == null) {
            // DM 테이블 제거
            chatDmRoomRepository.deleteById(findDmRoom.getChatDmRoomId());

            //DM 채팅방에 해당하는 모든 Message 삭제
            chatDmMessageRepository.deleteByChatDmRoom_ChatDmRoomId(findDmRoom.getChatDmRoomId());
            //둘 다 나가면 반환 되는 메세지는 없다.
            return null;
        }

        //나가려는 유저와 같은 User정보를 null로 바꾼다.
        if (findDmRoom.getUser1().getUserId().equals(leaveUserId))
            chatDmRoomRepository.removeUser1FromChatRoom(findDmRoom.getChatDmRoomId());
        else
            chatDmRoomRepository.removeUser2FromChatRoom(findDmRoom.getChatDmRoomId());

        //시스템 메세지를 저장
        chatDmMessageRepository.save(ChatDmMessage.builder()
                .message(leaveUser.getNickname() + "님이 채팅방을 나갔습니다.")
                .createdAt(LocalDateTime.now())
                .user(leaveUser)
                .build());

        //채팅방을 나갔다는 메세지를 전송한다.
        Map<String, Object> result = new HashMap<>();
        result.put("userId", null);
        result.put("user", null);
        result.put("message", leaveUser.getNickname() + "님이 채팅방을 나갔습니다.");
        return mapper.writeValueAsString(result);
    }

    public Map<String, Object> saveMessageAndPush(ChatDmRoom chatDmRoom, User sender, User receiver, String message){
        //채팅 메세지를 저장
        chatDmMessageRepository.save(ChatDmMessage.builder()
                .chatDmRoom(chatDmRoom)
                .user(sender)
                .message(message)
                .createdAt(LocalDateTime.now())
                .build());

        //받은 메세지 내용은 그대로 돌려준다
        Map<String, Object> result = new HashMap<>();
        result.put("dmRoomId", chatDmRoom.getChatDmRoomId());
        result.put("userId", sender.getUserId());
        result.put("user", sender);
        result.put("message", message);

        //PushService.send(User sender, User receiver, PushType pushType, String content, String url)
        String pushContent = sender.getNickname() + "님께서 메세지를 보내셨습니다.\n" + message;
        pushService.send(sender, receiver, PushType.CHAT, pushContent, neighbrewUrl + "/dmurl");;
        return result;
    }
}
