package com.ssafy.backend.controller;

import com.ssafy.backend.dto.SubReviewRequestDto;
import com.ssafy.backend.dto.SubReviewResponseDto;
import com.ssafy.backend.entity.SubReview;
import com.ssafy.backend.service.SubReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/subreview")
@RequiredArgsConstructor
@Slf4j
public class SubReviewController {
    private final SubReviewService subReviewService;

    // 리뷰의 댓글을 조회하는 API
    @GetMapping("/list/{reviewId}")
    public ResponseEntity<List<SubReviewResponseDto>> getSubReviewsWithUserByDrinkReviewId(@PathVariable Long reviewId) {
        List<SubReview> subReviews = subReviewService.findByDrinkReviewId(reviewId);
        return ResponseEntity.ok().body(subReviews.stream()
                .map(SubReviewResponseDto::fromEntity)
                .collect(Collectors.toList()));
    }


    // 리뷰의 댓글을 작성하는 API
    @PostMapping("/write")
    public ResponseEntity<SubReviewResponseDto> writeSubReview(@RequestBody SubReviewRequestDto subReviewRequestDto, HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return ResponseEntity.ok().body(SubReviewResponseDto.fromEntity(subReviewService.writeSubReview(subReviewRequestDto, Long.valueOf(userId))));
    }

    // 댓글 삭제 API
    @DeleteMapping("/delete/{subReviewId}")
    public ResponseEntity<?> deleteSubReview(@PathVariable Long subReviewId, HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        // 삭제 성공
        subReviewService.deleteSubReview(subReviewId, Long.valueOf(userId));
        return ResponseEntity.ok().body("댓글 삭제 성공");
    }

    // 댓글을 수정하는 API
    @PutMapping("/update")
    public ResponseEntity<SubReviewResponseDto> updateSubReview(@RequestBody SubReviewRequestDto subReviewRequestDto) {
        return ResponseEntity.ok().body(SubReviewResponseDto.fromEntity(subReviewService.updateSubReview(subReviewRequestDto, subReviewRequestDto.getUserId())));
    }
}
