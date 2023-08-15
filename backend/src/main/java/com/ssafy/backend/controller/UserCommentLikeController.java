package com.ssafy.backend.controller;

import com.ssafy.backend.service.UserCommentLikeService;
import com.ssafy.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/like")
public class UserCommentLikeController {
    private final UserCommentLikeService userCommentLikeService;

    @GetMapping("/{reviewId}")
    public ResponseEntity<?> getIsLik(@PathVariable Long reviewId, @RequestHeader("Authorization") String token) {
        Long userId = JwtUtil.parseUserIdFromToken(token);
        log.info("userId: {}", userId);
        return ResponseEntity.ok(userCommentLikeService.getIsLike(userId, reviewId));
    }

    @PostMapping("/{reviewId}")
    public ResponseEntity<String> userLikeReview(@RequestHeader("Authorization") String token, @PathVariable Long reviewId) {
        Long userId = JwtUtil.parseUserIdFromToken(token);
        boolean isLiked = userCommentLikeService.toggleUserLike(userId, reviewId);

        if (isLiked) return ResponseEntity.ok("좋아요 등록 성공");
        return ResponseEntity.ok("좋아요 취소 성공");
    }
}
