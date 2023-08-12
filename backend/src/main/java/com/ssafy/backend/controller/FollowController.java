package com.ssafy.backend.controller;

import com.ssafy.backend.dto.follow.FollowResponseDto;
import com.ssafy.backend.service.FollowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/follow")
public class FollowController {
    private final FollowService followService;

    @GetMapping("/guard/followers")
    public ResponseEntity<List<FollowResponseDto>> getFollowers(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(followService.getFollowers(Long.valueOf(userId)));
    }

    @GetMapping("/follower/{userId}")
    public ResponseEntity<List<FollowResponseDto>> getFollowers(@PathVariable Long userId) {
        return ResponseEntity.ok(followService.getFollowers(userId));
    }

    @GetMapping("/following/{userId}")
    public ResponseEntity<List<FollowResponseDto>> getFollowing(@PathVariable Long userId) {
        return ResponseEntity.ok(followService.getFollowing(userId));
    }

    @PostMapping("/guard/{followingId}")
    public ResponseEntity<String> followUser(HttpServletRequest request, @PathVariable Long followingId) {
        String userId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(followService.toggleFollow(Long.valueOf(userId), followingId));
    }

}
