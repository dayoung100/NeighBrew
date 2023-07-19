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
        this.clients = clients.stream().collect(
                Collectors.toUnmodifiableMap(OAuthApiClient::oAuthProvider, Function.identity())
        );
    }

    public OAuthInfoResponse request(OAuthLoginParams params) {
        // 어떤 클라이언트인지 확인
        OAuthApiClient client = clients.get(params.oAuthProvider());

        //여기서 acessToken은 kakao, naver로부터 받아온 token
        String accessToken = client.requestAccessToken(params);
        System.out.println("1 : accessToken = " + accessToken);


        return client.requestOauthInfo(accessToken);
    }



    public String authAptUrl(OAuthLoginParams params){
        OAuthApiClient client = clients.get(params.oAuthProvider());
        String url = client.authApiUrl(params);
        return url;
    }






}
