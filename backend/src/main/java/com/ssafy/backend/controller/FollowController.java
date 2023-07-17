package com.ssafy.backend.controller;

import com.ssafy.backend.entity.Follow;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.FollowRepository;
import com.ssafy.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
    public void followUser(@PathVariable Long followerId, @PathVariable Long followingId) {
        User follower = userRepository.findById(followerId).orElseThrow(() -> new IllegalArgumentException("Invalid followerId: " + followerId));
        User following = userRepository.findById(followingId).orElseThrow(() -> new IllegalArgumentException("Invalid followingId: " + followingId));

        Follow follow = new Follow();
        follow.setFollower(follower);
        follow.setFollowing(following);

        followRepository.save(follow);
    }

    @DeleteMapping("/{followerId}/{followingId}")
    public void unfollowUser(@PathVariable Long followerId, @PathVariable Long followingId) {
        Follow follow = followRepository.findByFollowerUserIdAndFollowingUserId(followerId, followingId).orElseThrow(() -> new IllegalArgumentException("Follow not found"));

        followRepository.delete(follow);
    }
}
