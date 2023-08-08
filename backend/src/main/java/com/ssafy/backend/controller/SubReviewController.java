package com.ssafy.backend.controller;

import com.ssafy.backend.dto.SubReviewDto;
import com.ssafy.backend.service.SubReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;

@RestController
@RequestMapping("/api/subreview")
@RequiredArgsConstructor
@Slf4j
public class SubReviewController {
    private final SubReviewService subReviewService;

    // 리뷰의 댓글을 조회하는 API
    @GetMapping("/list/{reviewId}")
    public ResponseEntity<?> getSubReviewList(@PathVariable Long reviewId) {
        return ResponseEntity.ok().body(subReviewService.getSubReviewList(reviewId));
    }


    // 리뷰의 댓글을 작성하는 API
    @PostMapping("/guard/write")
    public ResponseEntity<?> writeSubReview(@RequestBody SubReviewDto subReviewDto, HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        log.info(userId); // 내가 작성
        return ResponseEntity.ok().body(subReviewService.writeSubReview(subReviewDto, Long.valueOf(userId)));
    }

    // 댓글 삭제 API
    @Transactional
    @DeleteMapping("/guard/delete/{subReviewId}")
    public ResponseEntity<?> deleteSubReview(@PathVariable Long subReviewId, HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        // 삭제 성공
        subReviewService.deleteSubReview(subReviewId, Long.valueOf(userId));
        return ResponseEntity.ok().body("댓글 삭제 성공");
    }

    // 댓글을 수정하는 API
    @Transactional
    @PutMapping("/guard/update")
    public ResponseEntity<?> updateSubReview(@RequestBody SubReviewDto subReviewDto, HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return ResponseEntity.ok().body(subReviewService.updateSubReview(subReviewDto, Long.valueOf(userId)));
    }
}
