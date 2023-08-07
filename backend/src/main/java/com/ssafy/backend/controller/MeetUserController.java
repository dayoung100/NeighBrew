package com.ssafy.backend.controller;

import com.ssafy.backend.service.MeetUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//모임 목록을 관장하는 컨트롤러
// 참여 상태, 유저가 주최한/참여힌/신청한 모임들을 조회 및 취소할 수 있다.
@RestController
@RequestMapping("/api/meet-user")
@Slf4j
@RequiredArgsConstructor
public class MeetUserController {
    private final MeetUserService meetUserService;

    //모든 미팅 정보를 출력한다.
    @GetMapping()
    public ResponseEntity<?> getAllMeets() {
        return ResponseEntity.ok(meetUserService.findAll());
    }
}
