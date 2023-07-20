package com.ssafy.backend.controller;

import com.ssafy.backend.entity.Follow;
import com.ssafy.backend.Enum.PushType;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.FollowRepository;
import com.ssafy.backend.repository.UserRepository;
import com.ssafy.backend.service.PushService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/follow")
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
    public void followUser(HttpServletRequest request, @PathVariable("followingId") Long followingId) {
        String followerId = (String) request.getAttribute("userId");
        User follower = userRepository.findById(Long.valueOf(followerId)).orElseThrow(() -> new IllegalArgumentException("Invalid followerId: " + followerId));
        User following = userRepository.findById(followingId).orElseThrow(() -> new IllegalArgumentException("Invalid followingId: " + followingId));

        Follow follow = new Follow();
        follow.setFollower(follower);
        follow.setFollowing(following);

        followRepository.save(follow);

        //로거 추가 및 push 이벤트 발생 테스트
        pushService.send(followerId, PushType.Follow, follower.getNickname() + "님께서 회원님을 팔로우하기 시작했습니다.", "http://localhost/mypage/" + follower.getUserId());
    }

    @DeleteMapping("/guard/{followingId}")
    public void unfollowUser(HttpServletRequest request, @PathVariable Long followingId) {
        String followerId = (String) request.getAttribute("userId");
        Follow follow = followRepository.findByFollowerUserIdAndFollowingUserId(Long.valueOf(followerId), followingId).orElseThrow(() -> new IllegalArgumentException("Follow not found"));

        followRepository.delete(follow);
    }
}
