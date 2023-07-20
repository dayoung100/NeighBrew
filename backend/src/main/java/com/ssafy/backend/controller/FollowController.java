package com.ssafy.backend.controller;

import com.ssafy.backend.entity.Follow;
import com.ssafy.backend.entity.PushType;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.FollowRepository;
import com.ssafy.backend.repository.UserRepository;
import com.ssafy.backend.service.PushService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/follow")
public class FollowController {
    private static final Logger logger = LoggerFactory.getLogger(PushController.class);
    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    private final PushService pushService;

    @Autowired
    public FollowController(FollowRepository followRepository,
                            UserRepository userRepository,
                            PushService pushService) {
        this.followRepository = followRepository;
        this.userRepository = userRepository;
        this.pushService = pushService;
    }

    @PostMapping("/guard/{followingId}")
    public void followUser(HttpServletRequest request,
                           @PathVariable("followingId") Long followingId) {
        Long followerId = (Long) request.getAttribute("userId");
        User follower = userRepository.findById(followerId).orElseThrow(() -> new IllegalArgumentException("Invalid followerId: " + followerId));
        User following = userRepository.findById(followingId).orElseThrow(() -> new IllegalArgumentException("Invalid followingId: " + followingId));

        Follow follow = new Follow();
        follow.setFollower(follower);
        follow.setFollowing(following);

        followRepository.save(follow);

        //로거 추가 및 push 이벤트 발생 테스트
        StringBuilder eventMessage = new StringBuilder();
        eventMessage.append(follower.getNickname())
                .append("님께서 회원님을 팔로우하기 시작했습니다.");
        StringBuilder targetUrl = new StringBuilder();
        targetUrl.append("http://localhost/mypage/")
                .append(follower.getUserId());
        pushService.send(followerId, PushType.Follow, eventMessage.toString(), targetUrl.toString());
    }

    @DeleteMapping("/guard/{followingId}")
    public void unfollowUser(HttpServletRequest request, @PathVariable Long followingId) {
        Long followerId = (Long) request.getAttribute("userId");
        Follow follow = followRepository.findByFollowerUserIdAndFollowingUserId(followerId, followingId).orElseThrow(() -> new IllegalArgumentException("Follow not found"));

        followRepository.delete(follow);
    }
}
