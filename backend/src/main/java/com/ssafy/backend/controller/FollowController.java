package com.ssafy.backend.controller;

import com.ssafy.backend.entity.Follow;
import com.ssafy.backend.Enum.PushType;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.FollowRepository;
import com.ssafy.backend.repository.UserRepository;
import com.ssafy.backend.service.FollowService;
import com.ssafy.backend.service.PushService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/follow")
@RequiredArgsConstructor
public class FollowController {
    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    private final PushService pushService;
    private final FollowService followService;

    @GetMapping("/guard/followers")
    public ResponseEntity<List<Follow>> getFollowers(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        userRepository.findById(Long.valueOf(userId))
                .orElseThrow(() -> new IllegalArgumentException("Invalid userId: " + userId));
        List<Follow> followers = followService.getFollowers(Long.valueOf(userId));

        return ResponseEntity.ok(followers);
    }

    @PostMapping("/guard/{followingId}")
    public ResponseEntity<?> followUser(HttpServletRequest request, @PathVariable("followingId") Long followingId) {
        User follower = userRepository.findById(followingId).orElseThrow(() -> new IllegalArgumentException("Invalid followerId: " + followingId));
        User following = userRepository.findById(followingId).orElseThrow(() -> new IllegalArgumentException("Invalid followingId: " + followingId));

        // 토글 방식의 팔로우 기능 구현
        followRepository.findByFollowerUserIdAndFollowingUserId(follower.getUserId(), followingId).ifPresentOrElse(followRepository::delete, () -> {
            Follow follow = new Follow();
            follow.setFollower(follower);
            follow.setFollowing(following);

            followRepository.save(follow);

            //로거 추가 및 push 이벤트 발생 테스트
            pushService.send(followingId, PushType.FOLLOW, follower.getNickname() + "님께서 회원님을 팔로우하기 시작했습니다.", "http://localhost/mypage/" + follower.getUserId());
        });

        return ResponseEntity.ok().build();
    }
}
