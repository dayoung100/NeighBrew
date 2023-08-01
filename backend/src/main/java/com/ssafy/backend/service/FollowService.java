package com.ssafy.backend.service;

import com.ssafy.backend.Enum.PushType;
import com.ssafy.backend.entity.Follow;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.FollowRepository;
import com.ssafy.backend.repository.PushRepository;
import com.ssafy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class FollowService {
    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    private final PushService pushService;
    private final PushRepository pushRepository;

    public List<Follow> getFollowers(Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("잘못된 userId입니다:" + userId));

        return followRepository.findFollowsByFollowing_UserId(userId);
    }

    public List<Follow> findByFollower(Long userId) {
        return followRepository.findByFollowing_UserId(userId).orElseThrow(() -> new IllegalArgumentException("팔로워 정보를 찾을 수 없습니다."));
    }

    // 팔로우 토글
    public String followToggle(Long userId, Long followingId) {
        User follower = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("잘못된 userId입니다: " + userId));
        User following = userRepository.findById(followingId).orElseThrow(() -> new IllegalArgumentException("잘못된 followingId입니다: " + followingId));

        return followRepository.findByFollowerUserIdAndFollowingUserId(userId, followingId).map(existingFollow -> {
            followRepository.delete(existingFollow);
            //pushRepository.deleteByUser_ReceiverUserId(following.getUserId());
//            pushService.send(following, PushType.FOLLOW, follower.getNickname() + "님이 팔로우하기 취소했습니다.", "http://localhost/mypage/" + follower.getUserId());

            return following.getNickname() + "님을 팔로우 취소하였습니다.";
        }).orElseGet(() -> {
            Follow follow = Follow.builder()
                    .follower(follower)
                    .following(following)
                    .build();
            followRepository.save(follow);

            log.info("{}", follow);

            // push 이벤트 발생
            pushService.send(following, follower, PushType.FOLLOW, follower.getNickname() + "님이 회원님을 팔로우하기 시작했습니다.", "http://localhost/mypage/" + follower.getUserId());
            // 팔로우가 성공한 경우
            return following.getNickname() + "님을 팔로우하였습니다.";
        });
    }
}
