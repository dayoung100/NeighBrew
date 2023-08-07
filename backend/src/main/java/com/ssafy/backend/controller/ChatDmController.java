package com.ssafy.backend.controller;

import com.ssafy.backend.service.ChatDmMessageService;
import com.ssafy.backend.service.ChatDmRoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/dm")
public class ChatDmController {
    private final ChatDmRoomService chatDmRoomService;
    private final ChatDmMessageService chatDmMessageService;

    // 방이 있는지 체크하는 로직
    @GetMapping("/check/{senderId}/{receiverId}")
    public ResponseEntity<?> checkDmRoomExist(@PathVariable Long senderId,
                                              @PathVariable Long receiverId){
        try{
            Long roomId = chatDmRoomService.checkDmRoomExist(senderId, receiverId);
            return ResponseEntity.ok(roomId);
        }catch(Exception e){
            return ResponseEntity.badRequest().body("DM을 체크하던 중 문제가 발생했습니다.\n" + e.getMessage());
        }
    }

    // 유저 아이디로 DM목록 조회
    @GetMapping("/list/{userId}")
    public ResponseEntity<?> getUserDmRooms(@PathVariable Long userId) {
        try{
            return ResponseEntity.ok(chatDmRoomService.findChatDmRoomsByUserId(userId));
        }catch(Exception e){
            return ResponseEntity.badRequest().body("DM 정보를 호출하던 중 에러가 발생했습니다.\n" + e.getMessage());
        }
    }

    //dm 방 별로 메세지들을 가져온다.
    @GetMapping("/message/{userId1}/{userId2}")
    public ResponseEntity<?> getDmMessages(@PathVariable Long userId1,
                                           @PathVariable Long userId2){
        try{
            return userId1.compareTo(userId2) < 0
            ? ResponseEntity.ok(chatDmMessageService.findDmMessagesByRoomId(userId2, userId1))
            : ResponseEntity.ok(chatDmMessageService.findDmMessagesByRoomId(userId1, userId2));
        }catch(Exception e){
            return ResponseEntity.badRequest().body("메세지 정보를 호출하던 중 에러가 발생했습니다.\n" + e.getMessage());
        }
    }
}
