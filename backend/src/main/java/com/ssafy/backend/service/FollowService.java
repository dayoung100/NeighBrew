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

    public List<Follow> findByFollower(Long userId) {
        return followRepository.findByFollowing_UserId(userId).orElseThrow(()-> new IllegalArgumentException("팔로워 정보를 찾을 수 없습니다."));
    }
}
