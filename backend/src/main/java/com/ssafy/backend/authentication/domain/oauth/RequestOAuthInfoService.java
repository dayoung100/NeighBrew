package com.ssafy.backend.authentication.domain.oauth;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class RequestOAuthInfoService {
    //외부 API 요청의 중복 로직을 공통화
    private final Map<OAuthProvider, OAuthApiClient> clients;

    public RequestOAuthInfoService(List<OAuthApiClient> clients) {
        // this.clients   현재 클래스의 인스턴스를 의미
        // client.stream()   : cilents를 스트림으로 반환한다.
        // Stream : 데이터를 처리하는데 유용한 기능들을 제공하는 컬렉션의 개념
        // collect : 스트림에서 요소들을 수집하는 메서드
        // toMap() : OAuthApiClient객체들을 map 형식으로 받아온다
        // OAuthApiClient::oAuthProvider : OAuthApiClient 클래스의 oAuthProvider 필드 값을 키로 사용
        this.clients = clients.stream().collect(
                Collectors.toUnmodifiableMap(OAuthApiClient::oAuthProvider, Function.identity())
        );
    }

    public OAuthInfoResponse request(OAuthLoginParams params) {
        // 어떤 클라이언트인지 확인
        OAuthApiClient client = clients.get(params.oAuthProvider());

        //여기서 accessToken은 kakao, naver로부터 받아온 token
        String accessToken = client.requestAccessToken(params);
        System.out.println("1 : accessToken = " + accessToken);

        return client.requestOauthInfo(accessToken);
    }


    public String authApiUrl(OAuthLoginParams params) {
        OAuthApiClient client = clients.get(params.oAuthProvider());
        return client.authApiUrl(params);
    }
}
