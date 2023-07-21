package com.ssafy.backend.controller;

import com.ssafy.backend.entity.Follow;
import com.ssafy.backend.entity.PushType;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.FollowRepository;
import com.ssafy.backend.repository.UserRepository;
import com.ssafy.backend.service.PushService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/follow")
public class FollowController {
    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    private final PushService pushService;

    @Autowired
    public FollowController(FollowRepository followRepository, UserRepository userRepository, PushService pushService) {
        this.followRepository = followRepository;
        this.userRepository = userRepository;
        this.pushService = pushService;
    }

    @PostMapping("/guard/{followingId}")
    public ResponseEntity<?> followUser(HttpServletRequest request, @PathVariable("followingId") Long followingId) {
        String followerId = (String) request.getAttribute("userId");
        User follower = userRepository.findById(Long.valueOf(followerId)).orElseThrow(() -> new IllegalArgumentException("Invalid followerId: " + followerId));
        User following = userRepository.findById(followingId).orElseThrow(() -> new IllegalArgumentException("Invalid followingId: " + followingId));

        // 토글 방식의 팔로우 기능 구현
        followRepository.findByFollowerUserIdAndFollowingUserId(Long.valueOf(followerId), followingId).ifPresentOrElse(followRepository::delete, () -> {
            Follow follow = new Follow();
            follow.setFollower(follower);
            follow.setFollowing(following);

            followRepository.save(follow);

            //로거 추가 및 push 이벤트 발생 테스트
            pushService.send(followerId, PushType.Follow, follower.getNickname() + "님께서 회원님을 팔로우하기 시작했습니다.", "http://localhost/mypage/" + follower.getUserId());
        });

        return ResponseEntity.ok().build();
    }
}
