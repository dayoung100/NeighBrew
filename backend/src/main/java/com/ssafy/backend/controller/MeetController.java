package com.ssafy.backend.controller;

import com.ssafy.backend.Enum.PushType;
import com.ssafy.backend.dto.MeetDto;
import com.ssafy.backend.dto.MeetUserDto;
import com.ssafy.backend.entity.Follow;
import com.ssafy.backend.entity.Meet;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.service.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

//모임 생성, 수정, 삭제를 관장하는 컨트롤러
@RestController
@RequestMapping("/api/meet")
@Slf4j
public class MeetController {
    private final MeetService meetService;
    private final MeetUserService meetUserService;
    private final PushService pushService;
    private final FollowService followService;
    private final UserService userService;

    @Autowired
    public MeetController(MeetService meetService,
                          MeetUserService meetUserService,
                          PushService pushService,
                          FollowService followService,
                          UserService userService
                          ) {
        this.meetService = meetService;
        this.meetUserService = meetUserService;
        this.pushService = pushService;
        this.followService = followService;
        this.userService = userService;
    }

    //모임 상세 정보 출력
    @GetMapping()
    public ResponseEntity<?> getAllMeet(){
        log.debug("모든 모임 모임 정보 상세 출력");
        return ResponseEntity.ok(meetService.findAll());
    }

    // meetId에 해당하는 모임 상세 정보 조회
    @GetMapping("/{meetId}")
    public ResponseEntity<?> getMeetById(@PathVariable Long meetId){
        log.debug("모임 정보 상세 출력 : {} ", meetId);
        return ResponseEntity.ok(meetService.findMeetUserByMeetId(meetId));
    }

    //유저와 관련된 모임 모두 출력
    @GetMapping("/mymeet/{userId}")
    public ResponseEntity<?> getMyMeetsById(@PathVariable Long userId){
        log.debug("모임 정보 상세 출력 : {} ", userId);
        return ResponseEntity.ok(meetService.findByUserId(userId));
    }

    //모임 생성
    @PostMapping("/{userId}")
    public ResponseEntity<?> saveMeet(@PathVariable Long userId,
                                      @RequestBody MeetDto meetDto) throws IllegalArgumentException{
        log.debug("유저{}가 모임 생성 : {}", userId, meetDto);
        try{
            Meet createdMeet = meetService.saveMeet(meetDto.toEntity());
            User hostUser = userService.findByUserId(userId);

            //MeetUser 정보를 추가한다.
            meetUserService.saveMeetUser(createdMeet, hostUser);
            
            //팔로워에게 메세지를 보낸다
            List<Follow> followers = followService.findByFollower(userId);
            for(Follow fw : followers){
                log.debug("follower 정보 출력 : {}", fw.getFollower());
                StringBuilder pushMessage = new StringBuilder();
                pushMessage.append(hostUser.getNickname()).append("님께서 회원님께서 모임(").append(createdMeet.getMeetName()).append(")을 생성했습니다.");
                pushService.send(fw.getFollower().getUserId(), PushType.CREATEMEET, pushMessage.toString(), "이동할 URL 입력");
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
        log.debug("\n수정하는 유저 :{} \n수정할 미팅ID : {}, \n 수정할 미팅 정보 : {}", meetId, meetDto);
        try{
            Meet updateMeet = meetService.updateMeet(meetId, meetDto.toEntity());
            //모임이 수정되면 모임에 참여한 사람들에게 Push 알림을 보낸다.
            MeetUserDto meetUser = meetService.findMeetUserByMeetId(meetId);

            for(User user : meetUser.getUsers()){
                log.debug("수정 알림 보낼 유저 정보 출력 : {}", user);
                StringBuilder pushMessage = new StringBuilder();
                pushMessage.append("모임( ").append(meetDto.getMeetName()).append(")의 내용이 수정되었습니다. 확인해 주세요.");
                pushService.send(userId, PushType.MODIFIDEMEET, pushMessage.toString(), "이동할 URL 입력");
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
        log.debug("삭제할 미팅ID : {}", meetId);
        try{
            Meet deleteMeet = meetService.findByMeetId(meetId);
            User hostUser = userService.findByUserId(userId);
            MeetUserDto meetUser = meetService.findMeetUserByMeetId(meetId);

            //해당 미팅에 참여한 사람들에게 Push 알림을 보낸다.
            for(User user : meetUser.getUsers()){
                log.debug("삭제 알림 보낼 유저 정보 출력 : {}", user);
                StringBuilder pushMessage = new StringBuilder();
                StringBuilder append = pushMessage.append(hostUser.getName() + "님 께서 생성한 모임").append("모임(").append(deleteMeet.getMeetName()).append(")이 삭제되었습니다.");
                pushService.send(user.getUserId(), PushType.DELETEMEET, pushMessage.toString(), "이동할 URL 입력");
            }

            //MeetUser 정보를 삭제한다.
            meetUserService.deleteMeetUser(deleteMeet, hostUser);

            //meet 정보를 삭제한다.
            meetService.deleteMeet(meetId);

            return ResponseEntity.ok("미팅 : " + meetId + " 삭제완료");
        }catch(IllegalArgumentException e ){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 참가자 : 모임 신청
    @PostMapping("/apply")
    public ResponseEntity<?> applyMeet(@RequestBody Map<String, Long> requestBody ){
        Long userId = requestBody.get("userId");
        Long meetId = requestBody.get("meetId");
        log.info("모임 신청할 정보를 출력한다. : {}, {}", userId, meetId);

        meetUserService.updateMeetStatus(userId, meetId);

        return ResponseEntity.ok(meetId + "모임에 신청 완료");
    }
    


    // 방장 : 모임 신청 관리
}

