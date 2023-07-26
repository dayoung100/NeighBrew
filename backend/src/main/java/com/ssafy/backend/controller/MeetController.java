package com.ssafy.backend.controller;

import com.ssafy.backend.Enum.PushType;
import com.ssafy.backend.Enum.Status;
import com.ssafy.backend.Enum.UploadType;
import com.ssafy.backend.dto.MeetDto;
import com.ssafy.backend.dto.MeetUserDto;
import com.ssafy.backend.entity.Follow;
import com.ssafy.backend.entity.Meet;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

//모임 생성, 수정, 삭제를 관장하는 컨트롤러
@Slf4j
@RestController
@RequestMapping("/api/meet")
@RequiredArgsConstructor
public class MeetController {
    private final MeetService meetService;
    private final MeetUserService meetUserService;
    private final PushService pushService;
    private final FollowService followService;
    private final UserService userService;
    private final S3Service s3Service;

    //모든 모임에 대해 출력
    @GetMapping()
    public ResponseEntity<?> getAllMeet() {
        log.info("모든 모임 모임 정보 상세 출력");
        return ResponseEntity.ok(meetService.findAll());
    }

    // meetId에 해당하는 모임 상세 정보 조회
    @GetMapping("/{meetId}")
    public ResponseEntity<?> getMeetById(@PathVariable Long meetId) {
        log.info("모임 정보 상세 출력 : {} ", meetId);
        return ResponseEntity.ok(meetService.findMeetUserByMeetId(meetId));
    }

    //유저와 관련된 모임 모두 출력
    @GetMapping("/mymeet/{userId}")
    public ResponseEntity<?> getMyMeetsById(@PathVariable Long userId) {
        log.info("모임 정보 상세 출력 : {} ", userId);
        return ResponseEntity.ok(meetService.findByUserId(userId));
    }

    //모임 생성
    @PostMapping("/{userId}")
    public ResponseEntity<?> saveMeet(@PathVariable Long userId,
                                      MeetDto meetDto,
                                      @RequestPart(value = "image", required = false) Optional<MultipartFile> multipartFile) throws IllegalArgumentException {
        log.info("유저{}가 모임 생성 : {}", userId, meetDto);
        multipartFile.ifPresent(file -> log.info("파일 이름 : {} ", file.getOriginalFilename()));

        try {
            meetDto.setImgSrc(s3Service.upload(UploadType.MEET, multipartFile.get()));
            Meet createdMeet = meetService.saveMeet(meetDto);
            User hostUser = userService.findByUserId(userId);

            //MeetUser 정보를 추가한다.
            meetUserService.saveMeetUser(createdMeet, hostUser, Status.CREATE);

            //팔로워에게 메세지를 보낸다
            List<Follow> followers = followService.findByFollower(userId);
            for (Follow fw : followers) {
                log.info("follower 정보 출력 : {}", fw.getFollower());
                StringBuilder pushMessage = new StringBuilder();
                pushMessage.append(hostUser.getNickname()).append("님께서 회원님께서 모임(").append(createdMeet.getMeetName()).append(")을 생성했습니다.");
                pushService.send(fw.getFollower().getUserId(), PushType.CREATEMEET, pushMessage.toString(), "이동할 URL 입력");
            }

            return ResponseEntity.ok(createdMeet);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

    //모임 수정
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateMeet(@PathVariable Long userId,
                                        @RequestBody MeetDto meetDto) {
        log.info("\n수정하는 유저 :{} \n 수정할 미팅 정보 : {}", meetDto);
        if (userId != meetDto.getHostId())
            return ResponseEntity.badRequest().body("모임장이 아니신 경우 모임 정보를 수정할 수 없습니다.");

        try {
            Meet updateMeet = meetService.updateMeet(meetDto.getMeetId(), meetDto);

            //모임이 수정되면 모임에 참여한 사람들에게 Push 알림을 보낸다.
            MeetUserDto meetUser = meetService.findMeetUserByMeetId(meetDto.getMeetId());
            log.info("유저 리스트 길이? {}", meetUser.getUsers().size());

            for (User user : meetUser.getUsers()) {
                log.info("수정 알림 보낼 유저 정보 출력 : {}", user.getUserId());
                StringBuilder pushMessage = new StringBuilder();
                pushMessage.append("모임( ").append(meetDto.getMeetName()).append(")의 내용이 수정되었습니다. 확인해 주세요.");
                pushService.send(userId, PushType.MODIFIDEMEET, pushMessage.toString(), "이동할 URL 입력");
            }

            return ResponseEntity.ok(updateMeet);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    //모임 삭제하기
    @DeleteMapping()
    public ResponseEntity<?> deleteMeet(@RequestBody Map<String, Long> requestBody) {
        Long userId = requestBody.get("userId");
        Long meetId = requestBody.get("meetId");

        log.info("삭제할 미팅ID : {}", meetId);
        try {
            Meet deleteMeet = meetService.findByMeetId(meetId);
            User hostUser = userService.findByUserId(userId);

            if (deleteMeet.getHostId() != userId)
                return ResponseEntity.badRequest().body("모임장이 아니신 경우 모임을 삭제 할 수 없습니다.");

            MeetUserDto meetUser = meetService.findMeetUserByMeetId(meetId);

            //해당 미팅에 참여한 사람들에게 Push 알림을 보낸다.
            for (User user : meetUser.getUsers()) {
                log.info("삭제 알림 보낼 유저 정보 출력 : {}", user);
                StringBuilder pushMessage = new StringBuilder();
                pushMessage.append(hostUser.getName() + "님 께서 생성한 모임").append("모임(").append(deleteMeet.getMeetName()).append(")이 삭제되었습니다.");
                pushService.send(user.getUserId(), PushType.DELETEMEET, pushMessage.toString(), "이동할 URL 입력");
            }

            //MeetUser 정보를 삭제한다.
            meetUserService.deleteMeetUser(deleteMeet);

            //meet 정보를 삭제한다.
            meetService.deleteMeet(meetId);

            return ResponseEntity.ok("미팅 : " + meetId + " 삭제완료");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 참가자 : 모임 신청
    @PostMapping("/apply")
    public ResponseEntity<?> applyMeet(@RequestBody Map<String, Long> requestBody) {
        try {
            Long userId = requestBody.get("userId");
            Long meetId = requestBody.get("meetId");
            log.info("모임 신청할 정보를 출력한다. : {}, {}", userId, meetId);

            Meet attendMeet = meetService.findByMeetId(meetId);
            User attendUser = userService.findByUserId(userId);

            //참가자의 모임 상태 추가 -> 데이터를 추가해야한다.
            meetUserService.saveMeetUser(attendMeet, attendUser, Status.ATTEND);

            //호스트에게 알림 제공 - meet의 hostId를 얻어와야한다.
            //public void send(Long receiver, PushType pushType, String content, String url) {
            StringBuilder sb = new StringBuilder();
            StringBuilder pushMessage = new StringBuilder();
            pushMessage.append(attendUser.getName() + "님께서 " + attendMeet.getMeetName() + "모임에 참여하고 싶어 합니다.");
            pushService.send(attendMeet.getHostId(), PushType.MEETACCESS, pushMessage.toString(), "이동할 url");


            return ResponseEntity.ok(meetId + "모임에 신청 완료");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 방장 : 모임 신청 관리
    @PostMapping("/manage")
    public ResponseEntity<?> manageMeetApply(@RequestBody Map<String, Object> requestBody) {
        try {
            return ResponseEntity.ok("");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}

