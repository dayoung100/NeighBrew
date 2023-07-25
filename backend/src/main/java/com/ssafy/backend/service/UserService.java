package com.ssafy.backend.service;

import com.ssafy.backend.dto.UserUpdateDto;
import com.ssafy.backend.entity.Follow;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.FollowRepository;
import com.ssafy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final FollowRepository followRepository;

    @Value("${oauth.kakao.client-id}")
    private String clientId;

    @Value("${oauth.kakao.url.auth}")
    private String authUrl;


    public Long getFollowerCount(Long userId) {
        Long followerCount = (long) followRepository.findFollowsByFollowing_UserId(userId).size();
        return followerCount;
    }

    public Long getFollowingCount(Long userId) {
        Optional<List<Follow>> aa = followRepository.findByFollowing_UserId(userId);
        System.out.println("aa.toString() = " + aa.toString());
      Long folloingCount = followRepository.findByFollowing_UserId(userId).stream().count();
      return  folloingCount;
    }

    public String redirectApiUrl() {
        String redirectUri = "http://localhost:8080/kakao/callback";
        String responseType = "code";
        String Url = authUrl + "/oauth/authorize" + "?client_id=" + clientId + "&redirect_uri=" + redirectUri + "&response_type=" + responseType;

        return Url;
    }

    public User findByUserId(Long userId) {
        return userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("유저 정보가 올바르지 않습니다."));
    }

    @Transactional
    public User updateUser(Long userId, UserUpdateDto updateDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("유저 정보가 올바르지 않습니다."));
        user.updateFromDto(updateDto);
        return userRepository.save(user);
    }
}
