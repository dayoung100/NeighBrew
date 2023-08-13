package com.ssafy.backend.controller;

import com.ssafy.backend.dto.EvaluationDto;
import com.ssafy.backend.service.EvaluationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/evaluation")
public class EvaluationController {
    private final EvaluationService evaluationService;

    // A모임에서 유저 1 이 유저 2를 평가하는 로직
    // 보내는 측이 유저 1이니까 사실상 유저 2만 있으면 되는거 아님?

    //
    @PostMapping("/")
    public ResponseEntity<?> goodEvaluation(@RequestBody EvaluationDto evaluationDto,  HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(evaluationService.calculateScoreByMeetId(evaluationDto, Long.valueOf(userId)));
    }


}
