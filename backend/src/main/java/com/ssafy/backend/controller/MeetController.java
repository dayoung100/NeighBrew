package com.ssafy.backend.controller;

import com.ssafy.backend.service.MeetService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//모임 생성, 수정, 삭제를 관장하는 컨트롤러
@RestController
@RequestMapping("/api/meet")
public class MeetController {
    private static final Logger logger = LoggerFactory.getLogger(MeetController.class);
    private MeetService meetService;

    @Autowired
    public MeetController(MeetService meetService) {
        this.meetService = meetService;
    }

    //모임 상세 정보 출력
    @GetMapping("/{meetId}")
    public ResponseEntity<?> getMeetById(@PathVariable Long meetId){
        logger.info("미팅 정보 상세 출력 : {} ", meetId);
        return ResponseEntity.ok(meetService.findById(meetId));
    }

    //

}

