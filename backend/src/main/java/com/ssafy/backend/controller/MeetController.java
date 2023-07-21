package com.ssafy.backend.controller;

import com.ssafy.backend.Enum.PushType;
import com.ssafy.backend.dto.MeetDto;
import com.ssafy.backend.entity.Follow;
import com.ssafy.backend.entity.Meet;
import com.ssafy.backend.entity.Push;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.FollowRepository;
import com.ssafy.backend.repository.UserRepository;
import com.ssafy.backend.service.MeetService;
import com.ssafy.backend.service.MeetUserService;
import com.ssafy.backend.service.PushService;
import com.ssafy.backend.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

//모임 생성, 수정, 삭제를 관장하는 컨트롤러
@RestController
@RequestMapping("/api/meet")
public class MeetController {
    private static final Logger logger = LoggerFactory.getLogger(MeetController.class);
    private final MeetService meetService;
    private final MeetUserService meetUserService;
    private final PushService pushService;
    private final FollowRepository followRepository;
    private final UserRepository userRepository;

    @Autowired
    public MeetController(MeetService meetService,
                          MeetUserService meetUserService,
                          PushService pushService,
                          FollowRepository followRepository,
                          UserRepository  userRepository) {
        this.meetService = meetService;
        this.meetUserService = meetUserService;
        this.pushService = pushService;
        this.followRepository = followRepository;
        this.userRepository= userRepository;
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

    //모임 생성
    @PostMapping("/{userId}")
    public ResponseEntity<?> saveMeet(@PathVariable Long userId,
                                      @RequestBody MeetDto meetDto) throws IllegalArgumentException{
        logger.info("유저{}가 모임 생성 : {}", userId, meetDto);
        try{
            Meet createdMeet = meetService.saveMeet(meetDto.toEntity());
            User hostUser = userRepository.findById(userId).orElseThrow(()-> new IllegalArgumentException("유저 정보가 올바르지 않습니다."));

            //MeetUser 정보를 추가한다.
            meetUserService.saveMeetUser(createdMeet, hostUser);
            
            //팔로워에게 메세지를 보낸다
            List<Follow> followers = followRepository.findByFollowing_UserId(userId).orElseThrow(()-> new IllegalArgumentException("팔로워 정보를 찾을 수 없습니다."));
            for(Follow fw : followers){
                logger.info("follower 정보 출력 : {}", fw.getFollower());
                StringBuilder pushMessage = new StringBuilder();
                pushMessage.append("유저").append(hostUser.getNickname()).append("님께서 회원님께서 모임(").append(createdMeet.getMeetName()).append(")을 생성했습니다.");
                pushService.send(String.valueOf(fw.getFollower().getUserId()), PushType.CREATEMEET, pushMessage.toString(), "이동할 URL 입력");
            }

            return ResponseEntity.ok(createdMeet);
        }catch(IllegalArgumentException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    //모임 수정
    @PutMapping("/{userId}/{meetId}")
    public ResponseEntity<?> updateMeet(@PathVariable Long userId,
                                        @PathVariable Long meetId,
                                        @RequestBody MeetDto meetDto){
        logger.info("\n수정하는 유저 :{} \n수정할 미팅ID : {}, \n 수정할 미팅 정보 : {}", meetId, meetDto);
        try{
            Meet updateMeet = meetService.updateMeet(meetId, meetDto.toEntity());
            List<Follow> followers = followRepository.findByFollowing_UserId(userId).orElseThrow(()-> new IllegalArgumentException("팔로워 정보를 찾을 수 없습니다."));

            for(Follow fw : followers){
                logger.info("follower 정보 출력 : {}", fw.getFollower());
                StringBuilder pushMessage = new StringBuilder();
                pushMessage.append("모임 : ").append(meetDto.getMeetName()).append("의 내용이 수정되었습니다. 확인해 주세요.");
                pushService.send(String.valueOf(fw.getFollower().getUserId()), PushType.MODIFIDEMEET, pushMessage.toString(), "이동할 URL 입력");
            }

            return ResponseEntity.ok(updateMeet);
        }catch(IllegalArgumentException e ){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    //모임 삭제하기
    @DeleteMapping("/{userId}/{meetId}")
    public ResponseEntity<?> deleteMeet(@PathVariable Long userId,
                                        @PathVariable Long meetId){
        logger.info("삭제할 미팅ID : {}", meetId);
        try{

            meetService.deleteMeet(meetId);
            User hostUser = userRepository.findById(userId).orElseThrow(()-> new IllegalArgumentException("유저 정보가 올바르지 않습니다."));
            List<Follow> followers = followRepository.findByFollowing_UserId(userId).orElseThrow(()-> new IllegalArgumentException("팔로워 정보를 찾을 수 없습니다."));

            //MeetUser 정보를 삭제한다.
            meetUserService.deleteMeetUser(createdMeet, hostUser);

            for(Follow fw : followers){
                logger.info("follower 정보 출력 : {}", fw.getFollower());
                StringBuilder pushMessage = new StringBuilder();
                pushMessage.append("모임 : ").append(meetDto.getMeetName()).append("의 내용이 수정되었습니다. 확인해 주세요.");
                pushService.send(String.valueOf(fw.getFollower().getUserId()), PushType.MODIFIDEMEET, pushMessage.toString(), "이동할 URL 입력");
            }

            return ResponseEntity.ok("미팅 : " + meetId + " 삭제완료");
        }catch(IllegalArgumentException e ){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 참가자 : 모임 신청

    // 방장 : 모임 신청 관리



}

