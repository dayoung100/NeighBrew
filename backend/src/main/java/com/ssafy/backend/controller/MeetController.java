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

import java.io.IOException;
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
        log.info("모든 모임 상세 출력");
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
        log.info("나의 모임 정보 상세 출력 : {} ", userId);
        return ResponseEntity.ok(meetService.findByUserId(userId));
    }

    //모임 생성
    @PostMapping("/create")
    public ResponseEntity<?> saveMeet(Long userId,
                                        MeetDto meetDto,
                                        Long drinkId,
                                        @RequestPart(value = "image", required = false) Optional<MultipartFile> multipartFile) throws IllegalArgumentException {
        if (userId == null) return ResponseEntity.badRequest().body("유저 정보가 입력되지 않았습니다.");
        if (drinkId == null) return ResponseEntity.badRequest().body("모임에 등록할 술 정보가 포함되지 않았습니다.");
        if (meetDto.getTagId() == null) return ResponseEntity.badRequest().body("모임에 등록할 태그 정보가 포함되지 않았습니다.");

        return ResponseEntity.ok(meetService.saveMeet(meetDto, userId, drinkId, multipartFile.get()));
    }

    //모임 수정
    @PutMapping("/modify/{userId}/{meetId}")
    public ResponseEntity<?> updateMeet(@PathVariable("userId") Long userId,
                                        @PathVariable("meetId") Long meetId,
                                        MeetDto meetDto,
                                        Long drinkId,
                                        @RequestPart(value = "image", required = false) Optional<MultipartFile> multipartFile) {
        if (drinkId == null) return ResponseEntity.badRequest().body("모임에 등록할 술 정보가 포함되지 않았습니다.");
        if (meetDto.getTagId() == null) return ResponseEntity.badRequest().body("모임에 등록할 태그 정보가 포함되지 않았습니다.");
        if (userId != meetDto.getHostId())
            return ResponseEntity.badRequest().body("모임장이 아니신 경우 모임 정보를 수정할 수 없습니다.");

        return ResponseEntity.ok(meetService.updateMeet(meetDto, userId, meetId, drinkId, multipartFile.get()));
    }

    //모임 삭제하기
    @DeleteMapping("/delete/{meetId}")
    public ResponseEntity<?> deleteMeet(@PathVariable Long meetId,
                                        @RequestBody Map<String, Long> requestBody) {
        Long hostId = requestBody.get("userId");

        return ResponseEntity.ok(meetService.deleteMeet(hostId, meetId));
    }

    // 참가자 : 모임 신청
    @PostMapping("/apply")
    public ResponseEntity<?> applyMeet(@RequestBody Map<String, Long> requestBody) {
        try {
            Long userId = requestBody.get("userId");
            Long meetId = requestBody.get("meetId");
            log.info("모임 신청할 정보를 출력한다. : {}, {}", userId, meetId);

            MeetUserDto meetUser = meetService.findMeetUserByMeetId(meetId);
            Long hostId = meetUser.getMeetDto().getHostId();

            User attendUser = userService.findByUserId(userId);
            User host = userService.findByUserId(hostId);

            //모임의 인원수 체크
            if (meetUser.getMeetDto().getNowParticipants() >= meetUser.getMeetDto().getMaxParticipants())
                return ResponseEntity.badRequest().body("해당 모임에 참여 인원이 가득 찼습니다.");

            //모임에 참가 했을 경우 제외한다.
            for (User user : meetUser.getUsers()) {
                if (userId == user.getUserId()) return ResponseEntity.badRequest().body("이미 참여하신 모임 입니다.");
            }

            //참가자의 모임 상태 추가 -> 데이터를 추가해야한다.
            meetUserService.saveMeetUser(meetUser.getMeetDto().toEntity(), attendUser, Status.APPLY);

//            //모임 참여했으니 모임 인원수를 증가시킨다
//            meetService.updateParticipants(meetId);

            //호스트에게 알림 제공 - meet의 hostId를 얻어와야한다.
            StringBuilder sb = new StringBuilder();
            StringBuilder pushMessage = new StringBuilder();
            pushMessage.append(attendUser.getName() + "님께서 " + meetUser.getMeetDto().getMeetName() + "모임에 참여하고 싶어 합니다.");
            pushService.send(attendUser, host, PushType.MEETACCESS, pushMessage.toString(), "이동할 url");

            return ResponseEntity.ok(meetId + "모임에 신청 완료");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 유저 : 모임 신청 취소
    @PutMapping("/exit")
    public ResponseEntity<?> exitMeet(@RequestBody Map<String, Long> requestBody) {

        try {
            Long userId = requestBody.get("userId");
            Long meetId = requestBody.get("meetId");
            log.info("{}유저 {}모임 신청 취소 ", userId, meetId);
            Meet meet = meetService.findByMeetId(meetId);

            //모임-유저테이블에서 해당 정보 삭제
            meetUserService.deleteExitUser(userId, meetId, Status.APPLY);
            //푸시알림 로그 삭제
            pushService.deletePushLog(PushType.MEETACCESS, userId, meet.getHostId());
            return ResponseEntity.ok("모임 신청 취소가 완료됐습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("모임 신청 취소에 문제가 발생했습니다." + e.getMessage());
        }

    }

    // 방장 : 모임 신청 관리
    @PostMapping("/manage-user")
    public ResponseEntity<?> manageMeetApply(@RequestBody Map<String, Object> requestBody) {
        try {
            Long userId = ((Number) requestBody.get("userId")).longValue();
            Long meetId = ((Number) requestBody.get("meetId")).longValue();
            boolean applyResult = (boolean) requestBody.get("applyResult");

            log.info("{}유저 {}모임 신청 관리 : 결과 {}", userId, meetId, applyResult);

            Meet manageMentMeet = meetService.findByMeetId(meetId);

            //Host유저와 관리할유저 리스트 반환(1개의 쿼리를 사용 하기 위함) 0번 : 호스트, 1번 : 관리할 유저
            List<User> users = userService.findByUserIdIn(manageMentMeet.getHostId(), userId);

            if (applyResult) {//신청 결과가 true
                //모임 상태를 변경 시킨다.
                meetUserService.updateMeetStatus(userId, meetId, Status.GUEST);
                //모임 참여 인원수 1증가 시킨다.
                meetService.updateParticipants(meetId);

                StringBuilder pushMessage = new StringBuilder();
                pushMessage.append("회원님께서 모임(").append(manageMentMeet.getMeetName()).append(")참여 되셨습니다.\n 즐거운 시간 되세요.");
                pushService.send(users.get(0), users.get(1), PushType.MEETACCESS, pushMessage.toString(), "http://i9b310.p.ssafy.");
                return ResponseEntity.ok(userId + "유저 " + meetId + "모임 신청 승인");
            } else {//신청 결과가 false
                //모임-유저 테이블에 해당 유저 데이터 삭제
                meetUserService.deleteExitUser(userId, meetId, Status.APPLY);
                //유저에게 push 알림 전송

                StringBuilder pushMessage = new StringBuilder();
                pushMessage.append("회원님께서 모임(").append(manageMentMeet.getMeetName()).append(")참여에 거절당했습니다.");
                pushService.send(users.get(0), users.get(1), PushType.MEETREJECT, pushMessage.toString(), "");
                return ResponseEntity.ok(userId + "유저 " + meetId + "모임 신청 거절");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    // 모임, 채팅 나가면 모임 나가기

}

