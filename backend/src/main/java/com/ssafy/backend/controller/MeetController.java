package com.ssafy.backend.controller;

import com.ssafy.backend.dto.MeetDto;
import com.ssafy.backend.entity.Meet;
import com.ssafy.backend.service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.Optional;

//모임 생성, 수정, 삭제를 관장하는 컨트롤러
@Slf4j
@RestController
@RequestMapping("/api/meet")
@RequiredArgsConstructor
public class MeetController {
    private final MeetService meetService;

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
        try{
            return ResponseEntity.ok(meetService.findMeetUserByMeetId(meetId));
        }catch(Exception e){
            return ResponseEntity.badRequest().body("모임 정보를 찾을 수 없습니다." + e.getMessage());
        }

    }

    //유저와 관련된 모임 모두 출력
    @GetMapping("/mymeet/{userId}")
    public ResponseEntity<?> getMyMeetsById(@PathVariable Long userId) {
        log.info("나의 모임 정보 상세 출력 : {} ", userId);
        try{
            return ResponseEntity.ok(meetService.findByUserId(userId));
        }catch(Exception e){
            return ResponseEntity.badRequest().body(userId + "님에 해당되는 모임 정보를 조회할 수 없습니다.\n" + e.getMessage());
        }
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

        try{
            Meet createdMeet = null;

            if(multipartFile.isPresent()) createdMeet = meetService.saveMeet(meetDto, userId, drinkId, multipartFile.get());
            else createdMeet = meetService.saveMeet(meetDto, userId, drinkId, null);

            return ResponseEntity.ok(createdMeet);
        }catch(Exception e){
            return ResponseEntity.badRequest().body("모임 생성에 실패했습니다." + e.getMessage());
        }
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
        if (!userId.equals(meetDto.getHostId())) return ResponseEntity.badRequest().body("모임장이 아니신 경우 모임 정보를 수정할 수 없습니다.");

        try{
            if(multipartFile.isPresent()) meetService.updateMeet(meetDto, userId, meetId, drinkId, multipartFile.get());
            else meetService.updateMeet(meetDto, userId, meetId, drinkId, null);

            return ResponseEntity.ok(meetId + "모임이 수정 되었습니다.");
        }catch(Exception e){
            return ResponseEntity.badRequest().body("모임 수정에 실패했습니다." + e.getMessage());
        }
    }

    //모임 삭제하기
    @DeleteMapping("/delete/{meetId}")
    public ResponseEntity<?> deleteMeet(@PathVariable Long meetId,
                                        @RequestBody Map<String, Long> requestBody) {
        Long hostId = requestBody.get("userId");
        try{
            meetService.deleteMeet(hostId, meetId);

            return ResponseEntity.ok(meetId + " 모임이 삭제 되었습니다.");
        }catch(Exception e){
            return ResponseEntity.ok("모임 삭제 중 문제가 발생했습니다.\n" + e.getMessage());
        }
    }

    // 참가자 : 모임 신청
    @PostMapping("/apply")
    public ResponseEntity<?> applyMeet(@RequestBody Map<String, Long> requestBody) {
        try{
            Long userId = requestBody.get("userId");
            Long meetId = requestBody.get("meetId");

            meetService.applyMeet(userId, meetId);
            return ResponseEntity.ok(meetId + "모임에 신청 완료");
        }catch(Exception e){
            return ResponseEntity.badRequest().body("모임에 신청 실패!" + e.getMessage());
        }

    }

    // 유저 : 모임 신청 취소
    @PutMapping("/apply-cancel")
    public ResponseEntity<?> applyCancelMeet(@RequestBody Map<String, Long> requestBody) {
        Long userId = requestBody.get("userId");
        Long meetId = requestBody.get("meetId");

        try{
            meetService.applyCancelMeet(userId, meetId);
            return ResponseEntity.ok("모임 신청 취소가 완료됐습니다.");
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.badRequest().body("모임 신청 취소에 문제가 발생했습니다.\n" + e.getMessage());
        }
    }

    // 유저 : 모임 나가기
    @DeleteMapping("/exit")
    public ResponseEntity<?> exitMeet(@RequestBody Map<String, Long> requestBody) {
        Long userId = requestBody.get("userId");
        Long meetId = requestBody.get("meetId");

        try {
            meetService.exitMeet(userId, meetId);

            return ResponseEntity.ok("모임(" + meetId + ")에서 정상적으로 나가졌습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("모임 탈퇴 중 문제가 발생했습니다.\n" + e.getMessage());
        }
    }

    // 방장 : 모임 신청 관리
    @PostMapping("/manage-user")
    public ResponseEntity<?> manageMeetApply(@RequestBody Map<String, Object> requestBody) {
        Long userId = ((Number) requestBody.get("userId")).longValue();
        Long meetId = ((Number) requestBody.get("meetId")).longValue();
        boolean applyResult = (boolean) requestBody.get("applyResult");

        try{
            return ResponseEntity.ok(meetService.manageMeet(userId, meetId, applyResult));
        }catch(Exception e){
            return ResponseEntity.badRequest().body("모임 관리에 실패했습니다." + e.getMessage());
        }
    }

}

