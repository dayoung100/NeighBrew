package com.ssafy.backend.service;

import com.ssafy.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;

    @Value("${oauth.kakao.client-id}")
    private String clientId;

    @Value("${oauth.kakao.url.auth}")
    private String authUrl;



    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    public String redirectApiUrl() {
        String redirectUri = "http://localhost:8080/kakao/callback";
        String responseType = "code";
        String Url = authUrl + "/oauth/authorize" + "?client_id=" + clientId + "&redirect_uri=" + redirectUri + "&response_type=" + responseType;

        return Url;
    }



//    public User registerUser(User user) {
//        // 이메일 중복 체크
//        if (userRepository.existsByEmail(user.getEmail())) {
//            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
//        }
//
//        // 닉네임 중복 체크
//        if (userRepository.existsByNickname(user.getNickname())) {
//            throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
//        }
//
//        // 전화번호 중복 체크
//        if (userRepository.existsByPhone(user.getPhone())) {
//            throw new IllegalArgumentException("이미 사용 중인 전화번호입니다.");
//        }
//
//
//        return userRepository.save(user);
//    }
}
