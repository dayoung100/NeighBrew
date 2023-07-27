package com.ssafy.backend.controller;

import com.ssafy.backend.service.UserCommentLikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/like")
public class UserCommentLikeController {
    private final UserCommentLikeService userCommentLikeService;

    @PostMapping("/guard/{reviewId}")
    public ResponseEntity<String> userLikeReview(HttpServletRequest request, @PathVariable Long reviewId) {
        String userId = (String) request.getAttribute("userId");
        boolean isLiked = userCommentLikeService.toggleUserLike(Long.valueOf(userId), reviewId);

        return isLiked ? ResponseEntity.ok("좋아요 등록 성공")
                :
                ResponseEntity.ok("좋아요 취소 성공");
    }
}
