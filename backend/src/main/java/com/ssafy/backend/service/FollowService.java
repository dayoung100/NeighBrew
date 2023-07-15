package com.ssafy.backend.service;

import com.ssafy.backend.entity.Follow;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.FollowRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FollowService {
    private final FollowRepository followRepository;

    public FollowService(FollowRepository followRepository) {
        this.followRepository = followRepository;
    }

    public void follow(User follower, User following) {
        Follow follow = new Follow();
        follow.setFollower(follower);
        follow.setFollowing(following);
        followRepository.save(follow);
    }

    public void unfollow(User follower, User following) {
        Follow follow = followRepository.findByFollowerAndFollowing(follower, following);
        if (follow != null) followRepository.delete(follow);
    }

    public boolean isFollowing(User follower, User following) {
        return followRepository.existsByFollowerAndFollowing(follower, following);
    }

    public List<User> getFollowers(User user) {
        List<Follow> followers = followRepository.findByFollowing(user);
        return followers.stream().map(Follow::getFollower).collect(Collectors.toList());
    }

    public List<User> getFollowing(User user) {
        List<Follow> followings = followRepository.findByFollower(user);
        return followings.stream().map(Follow::getFollowing).collect(Collectors.toList());

    }
}
