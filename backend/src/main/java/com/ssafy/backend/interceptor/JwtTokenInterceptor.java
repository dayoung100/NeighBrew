package com.ssafy.backend.interceptor;

import com.ssafy.backend.authentication.domain.AuthTokensGenerator;
import com.ssafy.backend.authentication.infra.JwtTokenProvider;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


@Component
public class JwtTokenInterceptor implements HandlerInterceptor {

    private final AuthTokensGenerator authTokensGenerator;

    @Autowired
    public JwtTokenInterceptor(AuthTokensGenerator authTokensGenerator) {
        this.authTokensGenerator = authTokensGenerator;
    }


 //   public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
//        String accessToken = extractAccessToken(request);
//
//        if (accessToken != null) {
//            try {
//                authTokensGenerator.jwtTokenCheck(accessToken);
//
//                return true;
//            } catch (ExpiredJwtException e) {
//                // 토큰 만료 처리
//                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//                return false;
//            } catch (JwtException e) {
//                // 기타 JWT 예외 처리
//                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//                return false;
//            }
//        }
//
//        // 액세스 토큰이 없는 경우에 대한 처리
//        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//        return false;
//    }

    private String extractAccessToken(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String jwtToken = authorizationHeader.substring(7); // "Bearer " 다음 부분부터 추출
            return jwtToken;
        }
        return null;
    }
}
