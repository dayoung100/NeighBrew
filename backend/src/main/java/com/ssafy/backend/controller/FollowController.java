package com.ssafy.backend.controller;

import com.ssafy.backend.entity.Follow;
import com.ssafy.backend.entity.PushType;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.FollowRepository;
import com.ssafy.backend.repository.PushRepository;
import com.ssafy.backend.repository.UserRepository;
import com.ssafy.backend.service.PushService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/follow")
public class FollowController {
    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(FollowController.class);
    private final PushService pushService;

    @Autowired
    public FollowController(FollowRepository followRepository, UserRepository userRepository, PushService pushService) {
        this.followRepository = followRepository;
        this.userRepository = userRepository;
        this.pushService = pushService;
    }

    @PostMapping("/{followerId}/{followingId}")
    public ResponseEntity<?> followUser(@PathVariable Long followerId, @PathVariable Long followingId) {
        User follower = userRepository.findById(followerId).orElseThrow(IllegalArgumentException::new);
        User following = userRepository.findById(followingId).orElseThrow(IllegalArgumentException::new);

        // 팔로우 했는지 화인
        // 팔로우 취소
        followRepository.findByFollowerAndFollowing(follower, following).ifPresentOrElse(followRepository::delete, () -> {
            // 팔로우
            Follow follow = new Follow();
            follow.setFollower(follower);
            follow.setFollowing(following);

            followRepository.save(follow);
        });

        return new ResponseEntity<>(HttpStatus.OK);
    }

    // 팔로워 조회
    @GetMapping("/follower/{userId}")
    public ResponseEntity<List<User>> getFollower(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElseThrow(IllegalArgumentException::new);
        return new ResponseEntity<>(followRepository.findByFollowing(user).orElseThrow(() -> new IllegalArgumentException("팔로워가 없습니다.")).stream().map(Follow::getFollower).collect(Collectors.toList()),
                HttpStatus.OK);
    }

    // 팔로잉 조회
    @GetMapping("/following/{userId}")
    public ResponseEntity<List<User>> getFollowing(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElseThrow(IllegalArgumentException::new);
        return new ResponseEntity<>(followRepository.findByFollower(user).orElseThrow(() -> new IllegalArgumentException("팔로잉 하지 않았습니다.")).stream().map(Follow::getFollowing).collect(Collectors.toList()),
                HttpStatus.OK);
    }

    @GetMapping(value = "follow", produces = "text/event-stream")
    public ResponseEntity<?> pushFollow() throws Exception {
        logger.info("팔로우 알림 접근");
        pushService.send(1L, PushType.Follow, "유저 2님께서 회원님을 팔로우하기 시작했습니다.", "http://localhost/follow/follow");
        return new ResponseEntity<String>("SUCCESS", HttpStatus.OK);
    }
}
