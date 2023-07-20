package com.ssafy.backend.authentication.application;


import com.ssafy.backend.authentication.domain.AuthTokens;
import com.ssafy.backend.authentication.domain.AuthTokensGenerator;
import com.ssafy.backend.authentication.domain.oauth.OAuthApiClient;
import com.ssafy.backend.authentication.domain.oauth.OAuthInfoResponse;
import com.ssafy.backend.authentication.domain.oauth.OAuthLoginParams;
import com.ssafy.backend.authentication.domain.oauth.RequestOAuthInfoService;
import com.ssafy.backend.authentication.infra.JwtTokenProvider;
import com.ssafy.backend.authentication.infra.kakao.KakaoLoginParams;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OAuthLoginService {

    /*
    카카오/네이버와 같은 OAuth 플랫폼에 인증 후 프로필 정보 가져오기
    email 정보로 사용자 확인 (없으면 새로 가입처리)
    Access Token 생성 후 내려주기
     */
    //private final MemberRepository memberRepository;
    private final UserRepository userRepository;
    private final AuthTokensGenerator authTokensGenerator;
    private final RequestOAuthInfoService requestOAuthInfoService;
    private final JwtTokenProvider jwtTokenProvider;




    public AuthTokens login(OAuthLoginParams params) {
        OAuthInfoResponse oAuthInfoResponse = requestOAuthInfoService.request(params);
        System.out.println("oAuthInfoResponse = " + oAuthInfoResponse);
        // 받아온 정보를 기반으로  userId를 추출
        Long userId = findOrCreateUser(oAuthInfoResponse);
        System.out.println("2 : userId = " + userId);
        // 그 아이디를 기반으로 token 생성
        return authTokensGenerator.generate(userId);
    }

//    public void logout(OAuthLoginParams params) {
//        OAuthInfoResponse oAuthInfoResponse = requestOAuthInfoService.logout(params);
//
//
//    }


    // 해당 이메일로 user의 id를 반환
    private Long findOrCreateUser(OAuthInfoResponse oAuthInfoResponse) {
        return userRepository.findByEmail(oAuthInfoResponse.getEmail())
                .map(User::getUserId)
                .orElseGet(() -> newUser(oAuthInfoResponse));
    }

    private Long newUser(OAuthInfoResponse oAuthInfoResponse) {
        User user = User.builder()
                .email(oAuthInfoResponse.getEmail())
                .nickname(oAuthInfoResponse.getNickname())
                .oAuthProvider(oAuthInfoResponse.getOAuthProvider())
                .build();

        return userRepository.save(user).getUserId();
    }




    public String redirectApiUrl(OAuthLoginParams params) {
        String url = requestOAuthInfoService.authAptUrl(params);
        return url;
    }


}



