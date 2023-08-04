package com.ssafy.backend.controller;

import com.ssafy.backend.entity.ChatMessage;
import com.ssafy.backend.service.ChatDmMessageService;
import com.ssafy.backend.service.ChatMessageService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("/api/dm-message")
public class ChatDmMessageController {
    private final ChatDmMessageService chatDmMessageService;

    //dm 방 별로 메세지들을 가져온다.
    @GetMapping("/{dmRoomId}")
    public ResponseEntity<?> getDmMessages(@PathVariable Long dmRoomId){
        try{
            return ResponseEntity.ok(chatDmMessageService.findDmMessagesByRoomId(dmRoomId));
        }catch(Exception e){
            return ResponseEntity.badRequest().body("메세지 정보를 호출하던 중 에러가 발생했습니다.\n" + e.getMessage());
        }
    }
}
