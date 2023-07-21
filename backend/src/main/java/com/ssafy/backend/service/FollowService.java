package com.ssafy.backend.service;

import com.ssafy.backend.entity.Follow;
import com.ssafy.backend.repository.FollowRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FollowService {
    private final FollowRepository followRepository;

    public List<Follow> getFollowers(Long userId) {
        return followRepository.findFollowsByFollowing_UserId(userId);
    }
}
