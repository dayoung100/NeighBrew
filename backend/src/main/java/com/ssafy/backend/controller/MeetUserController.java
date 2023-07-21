package com.ssafy.backend.controller;

import com.ssafy.backend.service.MeetUserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//모임 목록을 관장하는 컨트롤러
// 참여 상태, 유저가 주최한/참여힌/신청한 모임들을 조회 및 취소할 수 있다.
@RestController
@RequestMapping("/api/meet-user")
public class MeetUserController {
    private static final Logger logger = LoggerFactory.getLogger(MeetUserController.class);
    private MeetUserService meetUserService;
    @Autowired
    public MeetUserController(MeetUserService meetUserService) {
        this.meetUserService = meetUserService;
    }

    //모든 미팅 정보를 출력한다.
    @GetMapping()
    public ResponseEntity<?> getAllMeets(){
        logger.info("생성된 모든 모임을 출력한다. : {}");
        return ResponseEntity.ok(meetUserService.findAll());
    }

    //User가 주최한/참여한/신청한 모임을을 출력한다.
    @GetMapping("/{userId}")
    public ResponseEntity<?> getCreatedMeetById(@PathVariable Long userId){
        logger.info("유저의 모든 모임을 출력한다. : {}", userId );

        return ResponseEntity.ok(meetUserService.getAllMeetstById(userId));
    }

    //유저가 모임에 가입 신청을 넣음

    //

}
