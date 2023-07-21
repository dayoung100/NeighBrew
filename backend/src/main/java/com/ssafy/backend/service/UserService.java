package com.ssafy.backend.service;

import com.ssafy.backend.dto.UserUpdateDto;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    @Value("${oauth.kakao.client-id}")
    private String clientId;

    @Value("${oauth.kakao.url.auth}")
    private String authUrl;

    public String redirectApiUrl() {
        String redirectUri = "http://localhost:8080/kakao/callback";
        String responseType = "code";
        String Url = authUrl + "/oauth/authorize" + "?client_id=" + clientId + "&redirect_uri=" + redirectUri + "&response_type=" + responseType;

        return Url;
    }
}
