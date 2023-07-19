package com.ssafy.backend.controller;

import com.ssafy.backend.service.MeetService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
        return new ResponseEntity<>(meetService.findAll(), HttpStatus.OK);
    };

    //유저 아이디에 해당하는 정보 반환
    @GetMapping("/{userId}")
    public ResponseEntity<?> findByUserId(@PathVariable Long userId){
        return new ResponseEntity.ok();
    }


}

