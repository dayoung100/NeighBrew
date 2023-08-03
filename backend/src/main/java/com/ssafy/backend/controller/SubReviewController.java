package com.ssafy.backend.controller;

import com.ssafy.backend.service.SubReviewService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/subreview")
@RequiredArgsConstructor
public class SubReviewController {
    private final SubReviewService subReviewService;

    // 리뷰의 댓글을 조회하는 API
    @GetMapping("/list/{reviewId}")
    public ResponseEntity<?> getSubReviewList(@PathVariable Long reviewId) {
        return ResponseEntity.ok().body(subReviewService.getSubReviewList(reviewId));
    }
}
