package com.ssafy.backend.authentication.application;


import com.ssafy.backend.authentication.domain.AuthTokens;
import com.ssafy.backend.authentication.infra.google.GoogleLoginParams;
import com.ssafy.backend.authentication.infra.kakao.KakaoLoginParams;
import com.ssafy.backend.authentication.infra.naver.NaverLoginParams;
import com.ssafy.backend.service.PushService;
import com.ssafy.backend.util.JwtUtil;
import io.jsonwebtoken.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final OAuthLoginService oAuthLoginService;
    private final PushService pushService;



    //사용자가 동의 후 여기에 넣으면 됨
    @PostMapping("/kakao")
    public ResponseEntity<?> loginKakao(@RequestBody KakaoLoginParams params) {
        return ResponseEntity.ok(oAuthLoginService.login(params));
    }

    @PostMapping("/naver")
    public ResponseEntity<?> loginNaver(@RequestBody NaverLoginParams params) {
        return ResponseEntity.ok(oAuthLoginService.login(params));
    }


    @PostMapping("/google")
    public ResponseEntity<?> loginGoogle(@RequestBody GoogleLoginParams params) {
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


    @GetMapping("/login/google")
    public ResponseEntity<Map<String, String>> loginRequsetResponse(GoogleLoginParams params)  {
        Map<String, String> response = new HashMap<>();
        response.put("URL", oAuthLoginService.redirectApiUrl(params));
        return ResponseEntity.ok(response);
    }

//    @GetMapping("/access-token/{userId}")
//    public ResponseEntity<Map<String, String>> jwtMaker(@PathVariable Long userId) {
//        String accessToken = JwtUtil.generateToken(String.valueOf(userId));
//        String refreshToken = JwtUtil.generateRefreshToken(String.valueOf(userId));
//        Map<String, String> tokens = new HashMap<>();
//        tokens.put("accessToken", accessToken);
//        tokens.put("refreshToken", refreshToken);
//        return ResponseEntity.ok(tokens);
//    }

    @GetMapping(value = "/connect/{userId}", produces = "text/event-stream")
    @ResponseStatus(HttpStatus.OK)
    public SseEmitter connect(@PathVariable Long userId,
                              @RequestHeader(value = "Last-Event-ID", required = false, defaultValue = "") String lastEventId) throws IOException {
        //log.info("@@@@@@@@@@@ 연결 시도 => id :{}, lastEventId {}\n", userId, lastEventId);
        log.info("{}", lastEventId);
        //클라이언트로 전달되는 것이 아닌, 클라이언트에게 지속적으로 알림을 제공하기 위한 연결 통로를 생성한다.
        return pushService.connect(userId, lastEventId);
    }
}
