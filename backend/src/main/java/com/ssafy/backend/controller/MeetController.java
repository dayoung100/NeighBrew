package com.ssafy.backend.controller;

import com.ssafy.backend.service.MeetService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/meet")
public class MeetController {

    private static final Logger logger = LoggerFactory.getLogger(MeetController.class);
    private MeetService meetService;

    @Autowired
    public MeetController(MeetService meetService) {
        this.meetService = meetService;
    }

    //모든 모임 정보 반환
    @GetMapping("")
    public ResponseEntity<?> findAll(){
        return ResponseEntity.ok(meetService.findAll());
    };

    //주종에 따른 모임 정보 반환 안쓸듯...
    @GetMapping("/")
    public ResponseEntity<?> findByDrinkCategory(@RequestParam(required = false) String tag){
        return ResponseEntity.ok(meetService.findByDrinkCategory(tag));
    };

    //모임 생성 상세정보
    @GetMapping("/{meetId}")
    public ResponseEntity<?> findByMeetId(@PathVariable Long meetId){
        return ResponseEntity.ok(meetService.findByMeetId(meetId));
    }



}

