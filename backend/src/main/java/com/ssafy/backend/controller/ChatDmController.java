package com.ssafy.backend.controller;

import com.ssafy.backend.service.ChatDmService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/dm")
public class ChatDmController {
    private final ChatDmService chatDmService;

    // 유저 아이디로 DM목록 조회
    @GetMapping("/list/{userId}")
    public ResponseEntity<?> getUserDmRooms(@PathVariable Long userId) {
        try{
            return ResponseEntity.ok(chatDmService.findMyDmList(userId));
        }catch(Exception e){
            return ResponseEntity.badRequest().body("DM 정보를 호출하던 중 에러가 발생했습니다.\n" + e.getMessage());
        }
    }

    //dm 방 별로 메세지들을 가져온다.
    @GetMapping("/message/{requestUser}/{user1Id}/{user2Id}")
    public ResponseEntity<?> getDmMessages(@PathVariable Long requestUser,
                                           @PathVariable Long user1Id,
                                           @PathVariable Long user2Id) {
        log.info("request유저{} : {}와{}의 메세지 가져오기", requestUser, user1Id, user2Id);
        try{
            return user1Id.compareTo(user2Id) < 0
            ? ResponseEntity.ok(chatDmService.findDmMessagesByRoomId(requestUser, user1Id, user2Id))
            : ResponseEntity.ok(chatDmService.findDmMessagesByRoomId(requestUser, user2Id, user1Id));
        }catch(Exception e){
            return ResponseEntity.badRequest().body("메세지 정보를 호출하던 중 에러가 발생했습니다.\n" + e.getMessage());
        }
    }
}
