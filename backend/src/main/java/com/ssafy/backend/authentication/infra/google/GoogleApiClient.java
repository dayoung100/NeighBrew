package com.ssafy.backend.authentication.infra.google;


import com.ssafy.backend.authentication.domain.oauth.OAuthApiClient;
import com.ssafy.backend.authentication.domain.oauth.OAuthInfoResponse;
import com.ssafy.backend.authentication.domain.oauth.OAuthLoginParams;
import com.ssafy.backend.authentication.domain.oauth.OAuthProvider;
import com.ssafy.backend.authentication.infra.kakao.KakaoTokens;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
@RequiredArgsConstructor
public class GoogleApiClient implements OAuthApiClient {


    @Value("${oauth.google.url.auth}")
    private String authUrl;

    @Value("${oauth.google.url.api}")
    private String apiUrl;

    @Value("${oauth.google.client-id}")
    private String clientId;
    @Value("${oauth.google.client_secret}")
    private String clientSecret;

    @Qualifier("restTemplate")
    private final RestTemplate restTemplate;

    @Override
    public OAuthProvider oAuthProvider() {
        return OAuthProvider.GOOGLE;
    }

    @Override
    public String requestAccessToken(OAuthLoginParams params) {
        String url = apiUrl;
        String code = params.code();
        System.out.println("code = " + code);
        String decodedData ="";
        try {
            String encodedData = null;
            decodedData = URLDecoder.decode(code, "UTF-8");
            System.out.println(decodedData);
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();

        body.add("code", decodedData);
        body.add("client_id", clientId);
        body.add("client_secret", clientSecret);
        body.add("redirect_uri","http://localhost:8080/google/callback" );
        body.add("grant_type","authorization_code");
        System.out.println("body.toString() = " + body.toString());

        HttpEntity<?> request = new HttpEntity<>(body, httpHeaders);

        GoogleTokens response = restTemplate.postForObject(url, request, GoogleTokens.class);



        assert response != null;

        return response.getAccessToken();
    }

    @Override
    public OAuthInfoResponse requestOauthInfo(String accessToken) {
        System.out.println("requestOauthInfo");
        String url = "https://www.googleapis.com/oauth2/v1/userinfo?access_token=" + accessToken;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        log.info("Authorization: " + "Bearer " + accessToken);

        HttpEntity request = new HttpEntity(headers);
        log.info("request HttpEntity:");

        try {
            ResponseEntity<GoogleInfoResponse.Response> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    request,
                    GoogleInfoResponse.Response.class
            );
            log.info("response.getBody() = " + response.getBody());
            GoogleInfoResponse.Response responseBody = response.getBody();
            if (responseBody != null) {
                return new GoogleInfoResponse(responseBody);
            }


            return null;

        }catch (Exception e){
            e.printStackTrace();
        }
        return null;


    }



//        HttpHeaders httpHeaders = new HttpHeaders();
//        httpHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
//        httpHeaders.set("Authorization", "Bearer " + accessToken);
//
//
//
//        HttpEntity<?> request = new HttpEntity<>(httpHeaders);
//
//
//
//        return restTemplate.postForObject(url, request, GoogleInfoResponse.class);


    @Override
    public String authApiUrl(OAuthLoginParams params) {
        String redirectUri = "http://localhost:8080/google/callback";
        String responseType = "code";
        String url = authUrl + "?client_id=" + clientId + "&redirect_uri=" + redirectUri + "&response_type=" + responseType +"&scope=email profile";
        return url;
    }





}
