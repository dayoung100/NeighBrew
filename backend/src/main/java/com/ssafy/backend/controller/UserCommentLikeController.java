package com.ssafy.backend.controller;

import com.ssafy.backend.service.UserCommentLikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/like")
public class UserCommentLikeController {
    private final UserCommentLikeService userCommentLikeService;

    @GetMapping("/{reviewId}")
    public ResponseEntity<?> getIsLik(@PathVariable Long reviewId, HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(userCommentLikeService.getIsLike(Long.valueOf(userId), reviewId));
    }

    @PostMapping("/{reviewId}")
    public ResponseEntity<String> userLikeReview(HttpServletRequest request, @PathVariable Long reviewId) {
        String userId = (String) request.getAttribute("userId");
        boolean isLiked = userCommentLikeService.toggleUserLike(Long.valueOf(userId), reviewId);

        return isLiked ? ResponseEntity.ok("좋아요 등록 성공")
                :
                ResponseEntity.ok("좋아요 취소 성공");
    }
}
