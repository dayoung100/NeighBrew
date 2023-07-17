package com.ssafy.backend.controller;

import com.ssafy.backend.entity.Follow;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.FollowRepository;
import com.ssafy.backend.repository.UserRepository;
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

    @Autowired
    public FollowController(FollowRepository followRepository, UserRepository userRepository) {
        this.followRepository = followRepository;
        this.userRepository = userRepository;
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
}
