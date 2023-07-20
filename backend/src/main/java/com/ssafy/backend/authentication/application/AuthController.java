package com.ssafy.backend.authentication.application;


import com.ssafy.backend.authentication.domain.AuthTokens;
import com.ssafy.backend.authentication.infra.kakao.KakaoLoginParams;
import com.ssafy.backend.authentication.infra.naver.NaverLoginParams;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final OAuthLoginService oAuthLoginService;


    //사용자가 동의 후 여기에 넣으면 됨
    @PostMapping("/kakao")
    public ResponseEntity<AuthTokens> loginKakao(@RequestBody KakaoLoginParams params) {
        return ResponseEntity.ok(oAuthLoginService.login(params));
    }

    @PostMapping("/naver")
    public ResponseEntity<AuthTokens> loginNaver(@RequestBody NaverLoginParams params) {
        return ResponseEntity.ok(oAuthLoginService.login(params));
    }

    @GetMapping("/login/kakao")
    public ResponseEntity<Map<String, String>> loginRequset(KakaoLoginParams params) {
        Map<String, String> response = new HashMap<>();
        response.put("URL", oAuthLoginService.redirectApiUrl(params));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/login/naver")
    public ResponseEntity<Map<String, String>> loginRequsetResponse(NaverLoginParams params) {
        Map<String, String> response = new HashMap<>();
        response.put("URL", oAuthLoginService.redirectApiUrl(params));
        return ResponseEntity.ok(response);
    }


}
