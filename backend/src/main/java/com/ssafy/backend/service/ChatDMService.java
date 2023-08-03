package com.ssafy.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.backend.entity.ChatDM;
import com.ssafy.backend.entity.ChatDMMessage;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.ChatDMMessageRepository;
import com.ssafy.backend.repository.ChatDMRepository;
import com.ssafy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatDMService {
    private final ChatDMRepository chatDMRepository;
    private final UserRepository userRepository;
    private final ObjectMapper mapper = new ObjectMapper();

//    @Transactional
//    public String createChatOrSend(Long senderId, Long receiverId, String message) throws JsonProcessingException {
//        User sender = userRepository.findById(senderId)
//                .orElseThrow(() -> new IllegalArgumentException("Sender does not exist."));
//        User receiver = userRepository.findById(receiverId)
//                .orElseThrow(() -> new IllegalArgumentException("Receiver does not exist."));
//
//        Optional<ChatDM> chatDMOptional = chatDMRepository.findChatRoomByUsers(sender, receiver);
//        ChatDM chatDM;
//
//        if (chatDMOptional.isPresent()) {
//            chatDM = chatDMOptional.get();
//        } else {
//            chatDM = ChatDM.builder()
//                    .sender(sender)
//                    .receiver(receiver)
//                    .build();
//            chatDMRepository.save(chatDM);
//        }
//
//        ChatDMMessage chatDMMessage = ChatDMMessage.builder()
//                .chatDM(chatDM)
//                .sender(sender)
//                .receiver(receiver)
//                .message(message)
//                .build();
//        chatDM.getChatDMMessages().add(chatDMMessage);
//
//        Map<String, String> map = new HashMap<>();
//        map.put("message", "Message sent successfully.");
//        String res = "";
//
//        res = mapper.writeValueAsString(map);
//
//        return res;
//    }
}

