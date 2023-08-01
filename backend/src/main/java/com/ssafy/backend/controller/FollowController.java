package com.ssafy.backend.controller;

import com.ssafy.backend.entity.Follow;
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
    public ResponseEntity<List<Follow>> getFollowers(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        List<Follow> followers = followService.getFollowers(Long.valueOf(userId));

        return ResponseEntity.ok(followers);
    }

    @GetMapping("/follower/{userId}")
    public ResponseEntity<List<Follow>> getFollowers(@PathVariable Long userId) {
        List<Follow> followers = followService.getFollowers(userId);
        return ResponseEntity.ok(followers);
    }

    @GetMapping("/following/{userId}")
    public ResponseEntity<List<Follow>> getFollowing(@PathVariable Long userId){
        List<Follow> following = followService.getFollowing(userId);
        return ResponseEntity.ok(following);
    }

    @PostMapping("/guard/{followingId}")
    public ResponseEntity<?> followUser(HttpServletRequest request, @PathVariable("followingId") Long followingId) {
        String userId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(followService.followToggle(Long.valueOf(userId), followingId));
    }
}
