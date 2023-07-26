package com.ssafy.backend.authentication.application;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.backend.authentication.domain.oauth.OAuthInfoResponse;
import com.ssafy.backend.authentication.domain.oauth.OAuthLoginParams;
import com.ssafy.backend.authentication.domain.oauth.RequestOAuthInfoService;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.UserRepository;
import com.ssafy.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class OAuthLoginService {

    /*
    카카오/네이버와 같은 OAuth 플랫폼에 인증 후 프로필 정보 가져오기
    email 정보로 사용자 확인 (없으면 새로 가입처리)
    Access Token 생성 후 내려주기
     */
    //private final MemberRepository memberRepository;
    private final UserRepository userRepository;
    private final RequestOAuthInfoService requestOAuthInfoService;


    public LoginResponse login(OAuthLoginParams params) {
        OAuthInfoResponse oAuthInfoResponse = requestOAuthInfoService.request(params);

        // 받아온 정보를 기반으로  userId를 추출
        ObjectMapper objectMapper = new ObjectMapper();
        try{
            String jsonString = objectMapper.writeValueAsString(oAuthInfoResponse);
            log.info(jsonString);

        }catch (Exception e){

        }

        Long userId = findOrCreateUser(oAuthInfoResponse);
        // 그 아이디를 기반으로 token 생성

        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setAccessToken(JwtUtil.generateToken(String.valueOf(userId)));
        loginResponse.setRefreshToken(JwtUtil.generateRefreshToken(String.valueOf(userId)));

        return loginResponse;
    }



    // 해당 이메일로 user의 id를 반환
    private Long findOrCreateUser(OAuthInfoResponse oAuthInfoResponse) {
        return userRepository.findByEmail(oAuthInfoResponse.getEmail())
                .map(User::getUserId)
                .orElseGet(() -> newUser(oAuthInfoResponse));
    }

    private Long newUser(OAuthInfoResponse oAuthInfoResponse) {
        User user = User.builder()
                .email(oAuthInfoResponse.getEmail())
                .name(oAuthInfoResponse.getName())
                .nickname(oAuthInfoResponse.getNickname())
                .oAuthProvider(oAuthInfoResponse.getOAuthProvider())
                .build();

        return userRepository.save(user).getUserId();
    }


    public String redirectApiUrl(OAuthLoginParams params) {
        return requestOAuthInfoService.authApiUrl(params);
    }
}