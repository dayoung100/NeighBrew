package com.ssafy.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.backend.dto.UserDto;
import com.ssafy.backend.entity.ChatDmMessage;
import com.ssafy.backend.entity.ChatDmRoom;
import com.ssafy.backend.repository.ChatDmRoomRepository;
import com.ssafy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import com.ssafy.backend.entity.User;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@Slf4j
@Service
@RequiredArgsConstructor
public class ChatDmRoomService {
    private final ChatDmRoomRepository chatDmRoomRepository;
    private final ChatDmMessageService chatDmMessageService;
    private final UserRepository userRepository;
    private final ObjectMapper mapper = new ObjectMapper();

    @Transactional
    public Map<String, Object> createChatOrSend(Long receiverId,
                                                String payload) throws JsonProcessingException {
        //클라이언트에서 보낸 메세지 데이터 파싱
        JsonNode jsonNode = mapper.readTree(payload);
        String message = String.valueOf(jsonNode.get("message"));
        Long senderId = jsonNode.get("userId").asLong();
        String userNickName = String.valueOf(jsonNode.get("userNickname"));
        log.info("메세지 데이터 파싱 결과 : {}, {}, {}", message, userNickName, senderId);

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException("Sender does not exist."));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new IllegalArgumentException("Receiver does not exist."));

        Optional<ChatDmRoom> chatDmRoomOptional = chatDmRoomRepository.findDmUsers(sender, receiver);
        ChatDmRoom chatDmRoom;

        //방이 있으면 받아온다
        if(!chatDmRoomOptional.isPresent()){
            chatDmRoom = chatDmRoomOptional.get();
        }else{//방이 없으면 먼저 보낸 사람을 중심으로 방을 생성한다.
            chatDmRoom = chatDmRoomRepository.save(ChatDmRoom.builder()
                    .user1(sender)
                    .user2(receiver)
                    .build());
        }

        //메세지 저장
        chatDmMessageService.save(ChatDmMessage.builder()
                        .chatDmRoom(chatDmRoom)
                        .sender(sender)
                        .content(message)
                        .createdAt(LocalDateTime.now())
                        .build());

        //반환할 유저 데이터(ID, NickName, 프로필URL)
        UserDto userData = UserDto.builder()
                .userId(senderId)
                .name(sender.getName())
                .profile(sender.getProfile())
                .nickname(sender.getNickname())
                .build();

        //받은 메세지 내용은 그대로 돌려준다
        Map<String, Object> result = new HashMap<>();
        result.put("dmRoomId", chatDmRoom.getChatDmRoomId());
        result.put("userId", senderId);
        result.put("user", userData);
        result.put("message", message);

        return result;
    }

    public String leaveDm(Long dmRoomId, String payload) throws JsonProcessingException {
        //데이터를 파싱한다.
        JsonNode jsonNode = mapper.readTree(payload);
        Long leaveUserId = jsonNode.get("userId").asLong();

        ChatDmRoom findDmRoom = chatDmRoomRepository.findById(dmRoomId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 채팅방 입니다."));
        User leaveUser = userRepository.findByUserId(leaveUserId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저 입니다."));

        //유저 정보가 채팅방에 유저가 1명 남은 상태에서 다시 접근하면 모든 데이터를 지운다.
        if(findDmRoom.getUser1() == null || findDmRoom.getUser2() == null){
            //dmRoom 삭제
            chatDmRoomRepository.deleteById(dmRoomId);
            //dmRoom에서 작성된 모든 dmMessage 삭제
            chatDmMessageService.deleteAllMessage(dmRoomId);

            //둘 다 나가면 반환 되는 메세지는 없다.
            return null;
        }

        //나가려는 유저와 같은 User정보를 null로 바꾼다.
        if(findDmRoom.getUser1().getUserId().equals(leaveUserId))
            chatDmRoomRepository.removeUser1FromChatRoom(dmRoomId);
        else
            chatDmRoomRepository.removeUser2FromChatRoom(dmRoomId);

        //시스템 메세지를 저장
        chatDmMessageService.save(ChatDmMessage.builder()
                .content(leaveUser.getNickname() + "님이 채팅방을 나갔습니다.")
                .createdAt(LocalDateTime.now())
                .sender(null)
                .build());

        //채팅방을 나갔다는 메세지를 전송한다.
        Map<String, Object> result = new HashMap<>();
        result.put("userId", null);
        result.put("user", null);
        result.put("",leaveUser.getNickname() + "님이 채팅방을 나갔습니다.");
        return mapper.writeValueAsString(result);
    }

    public List<ChatDmRoom> findChatDmRoomsByUserId(Long userId) {
        return null;
    }
}

