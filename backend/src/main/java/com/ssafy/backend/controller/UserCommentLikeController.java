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
@RequestMapping("/api/like")
@RequiredArgsConstructor
public class UserCommentLikeController {
    private final UserCommentLikeService userCommentLikeService;

    @PostMapping("/guard/{reviewId}")
    public ResponseEntity<?> userLikeReview(HttpServletRequest request, @PathVariable Long reviewId) {
        String userId = (String) request.getAttribute("userId");

        userCommentLikeService.createUserLike(Long.valueOf(userId), reviewId);

        return ResponseEntity.ok().build();
    }
}
