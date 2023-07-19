package com.ssafy.backend.controller;

import com.ssafy.backend.entity.Follow;
import com.ssafy.backend.entity.Push;
import com.ssafy.backend.entity.PushType;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.FollowRepository;
import com.ssafy.backend.repository.UserRepository;
import com.ssafy.backend.service.PushService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/{followerId}/{followingId}")
    public void followUser(@PathVariable("followerId") Long followerId,
                           @PathVariable("followingId") Long followingId) {
        logger.info("\n follower : {} \n following {}:", followerId, followingId);
        User follower = userRepository.findById(followerId).orElseThrow(() -> new IllegalArgumentException("Invalid followerId: " + followerId));
        User following = userRepository.findById(followingId).orElseThrow(() -> new IllegalArgumentException("Invalid followingId: " + followingId));

        logger.info("\n follower : {} \n following {}:", follower, following);
        Follow follow = new Follow();
        follow.setFollower(follower);
        follow.setFollowing(following);

        followRepository.save(follow);

        StringBuilder eventMessage = new StringBuilder();
        eventMessage.append(follower.getNickname())
                    .append("님께서 회원님을 팔로우하기 시작했습니다.");
        StringBuilder targetUrl = new StringBuilder();
        targetUrl.append("http://localhost/mypage/")
                 .append(follower.getUserId());
        pushService.send(followerId, PushType.Follow, eventMessage.toString(), targetUrl.toString());
    }

    @DeleteMapping("/{followerId}/{followingId}")
    public void unfollowUser(@PathVariable Long followerId, @PathVariable Long followingId) {
        Follow follow = followRepository.findByFollowerUserIdAndFollowingUserId(followerId, followingId).orElseThrow(() -> new IllegalArgumentException("Follow not found"));

        followRepository.delete(follow);
    }
}
