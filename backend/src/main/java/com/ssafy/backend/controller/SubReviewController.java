package com.ssafy.backend.controller;

import com.ssafy.backend.dto.SubReviewDto;
import com.ssafy.backend.service.SubReviewService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

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


    // 리뷰의 댓글을 작성하는 API
    @PostMapping("/guard/write/{reviewId}")
    public ResponseEntity<?> writeSubReview(@PathVariable Long reviewId, @RequestBody SubReviewDto subReviewDto, HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return ResponseEntity.ok().body(subReviewService.writeSubReview(reviewId, subReviewDto, Long.valueOf(userId)));
    }
}
