package com.ssafy.backend.controller;

import com.ssafy.backend.dto.MeetDto;
import com.ssafy.backend.entity.Push;
import com.ssafy.backend.service.MeetService;
import com.ssafy.backend.service.MeetUserService;
import com.ssafy.backend.service.PushService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

//모임 생성, 수정, 삭제를 관장하는 컨트롤러
@RestController
@RequestMapping("/api/meet")
public class MeetController {
    private static final Logger logger = LoggerFactory.getLogger(MeetController.class);
    private MeetService meetService;
    private MeetUserService meetUserService;
    private PushService pushService;

    @Autowired
    public MeetController(MeetService meetService,
                          MeetUserService meetUserService,
                          PushService pushService) {
        this.meetService = meetService;
        this.meetUserService = meetUserService;
        this.pushService = pushService;
    }

    //모임 상세 정보 출력
    @GetMapping()
    public ResponseEntity<?> getAllMeet(){
        logger.info("모든 모임 모임 정보 상세 출력");
        return ResponseEntity.ok(meetService.findAll());
    }

    //모임 상세 정보 출력
    @GetMapping("/{meetId}")
    public ResponseEntity<?> getMeetById(@PathVariable Long meetId){
        logger.info("모임 정보 상세 출력 : {} ", meetId);
        return ResponseEntity.ok(meetService.findById(meetId));
    }

    //모임 추가
    @PostMapping()
    public ResponseEntity<?> saveMeet(@RequestBody MeetDto meetDto) throws IllegalArgumentException{
        logger.info("모임 생성 : {}", meetDto);

        try{
            return ResponseEntity.ok(meetService.saveMeet(meetDto.toEntity()));
        }catch(IllegalArgumentException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    //모임 수정
    @PutMapping("/{meetId}")
    public ResponseEntity<?> updateMeet(@PathVariable Long meetId, @RequestBody MeetDto meetDto){

        try{
            logger.info("\n수정할 미팅ID : {}, \n 수정할 미팅 정보 : {}", meetId, meetDto);
            return ResponseEntity.ok(meetService.updateMeet(meetId, meetDto.toEntity()));
        }catch(IllegalArgumentException e ){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    //모임 삭제하기
    @DeleteMapping("/{meetId}")
    public ResponseEntity<?> deleteMeet(@PathVariable Long meetId){
        try{
            logger.info("삭제할 미팅ID : {}", meetId);
            return ResponseEntity.ok("미팅 : " + meetId + " 삭제완료");
        }catch(IllegalArgumentException e ){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    //모임 상태 관리



}

