package com.ssafy.backend.controller;

import com.ssafy.backend.service.EvaluationService;
import com.ssafy.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/evaluation")
public class EvaluationController {
    private final EvaluationService evaluationService;

    // A모임에서 유저 1 이 유저 2를 평가하는 로직
    // 보내는 측이 유저 1이니까 사실상 유저 2만 있으면 되는거 아님?

    //
    @GetMapping("/guard/{meetId}/good/{userId}")
    public ResponseEntity<?> goodEvaluation(@PathVariable Long meetId, @PathVariable Long userId) {
        return ResponseEntity.ok(evaluationService.calculateScoreByMeetId(meetId, userId, "good"));
    }


    @GetMapping("/guard/{meetId}/mid/{userId}")
    public ResponseEntity<?> middleEvaluation(@PathVariable Long meetId,@PathVariable Long userId){
        return ResponseEntity.ok(evaluationService.calculateScoreByMeetId(meetId, userId, "mid"));
    }

    @GetMapping("/guard/{meetId}/bad/{userId}")
    public ResponseEntity<?> badEvaluation(@PathVariable Long meetId, @PathVariable Long userId) {
        return ResponseEntity.ok(evaluationService.calculateScoreByMeetId(meetId, userId, "bad"));
    }



}
