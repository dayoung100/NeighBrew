package com.ssafy.backend.interceptor;

import com.ssafy.backend.util.JwtUtil;
import io.jsonwebtoken.Claims;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class TokenInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "토큰이 존재하지 않습니다.");
        }

        String token = header.substring(7);
        Claims claims = JwtUtil.getClaims(token);

        String tokenUserId = claims.getSubject();

        // 요청 헤더에서 "UserID"로 userId를 받아온다
        String requestUserId = request.getHeader("UserID");

        if (requestUserId == null || !requestUserId.equals(tokenUserId)) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "토큰의 유저 정보와 일치하지 않습니다.");
        }

        request.setAttribute("userId", tokenUserId);
        return true;
    }
}
