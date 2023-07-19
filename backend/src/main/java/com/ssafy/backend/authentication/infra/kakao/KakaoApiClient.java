package com.ssafy.backend.authentication.infra.kakao;


import com.ssafy.backend.authentication.domain.oauth.OAuthApiClient;
import com.ssafy.backend.authentication.domain.oauth.OAuthInfoResponse;
import com.ssafy.backend.authentication.domain.oauth.OAuthLoginParams;
import com.ssafy.backend.authentication.domain.oauth.OAuthProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Component
@RequiredArgsConstructor
public class KakaoApiClient implements OAuthApiClient {

    private static final String GRANT_TYPE = "authorization_code";

    @Value("${oauth.kakao.url.auth}")
    private String authUrl;

    @Value("${oauth.kakao.url.api}")
    private String apiUrl;

    @Value("${oauth.kakao.client-id}")
    private String clientId;

    private final RestTemplate restTemplate;

    @Override
    public OAuthProvider oAuthProvider() {
        return OAuthProvider.KAKAO;
    }

    @Override
    public String requestAccessToken(OAuthLoginParams params) {
        String url = authUrl + "/oauth/token";

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        System.out.println("request Access Token params = " + params);

        MultiValueMap<String, String> body = params.makeBody();
        body.add("grant_type", GRANT_TYPE);
        body.add("client_id", clientId);

        System.out.println("MultiValueMap = " + body.toString());

        HttpEntity<?> request = new HttpEntity<>(body, httpHeaders);

        System.out.println("request = " + request);

        KakaoTokens response = restTemplate.postForObject(url, request, KakaoTokens.class);

        System.out.println("response = " + response);

        assert response != null;
        System.out.println("response.getAccessToken() = " + response.getAccessToken());
        return response.getAccessToken();
    }

    @Override
    public OAuthInfoResponse requestOauthInfo(String accessToken) {
        String url = apiUrl + "/v2/user/me";

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        httpHeaders.set("Authorization", "Bearer " + accessToken);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("property_keys", "[\"kakao_account.email\", \"kakao_account.profile\"]");

        HttpEntity<?> request = new HttpEntity<>(body, httpHeaders);

        return restTemplate.postForObject(url, request, KakaoInfoResponse.class);
    }

    @Override
    public String authApiUrl(OAuthLoginParams params) {
        String redirectUri = "http://localhost:8080/kakao/callback";
        String responseType = "code";
        String url = authUrl + "/oauth/authorize" + "?client_id=" + clientId + "&redirect_uri=" + redirectUri + "&response_type=" + responseType;
        return url;
    }


}
