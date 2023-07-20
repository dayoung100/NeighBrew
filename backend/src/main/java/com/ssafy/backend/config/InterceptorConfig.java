package com.ssafy.backend.config;

import com.ssafy.backend.interceptor.JwtTokenInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class InterceptorConfig implements WebMvcConfigurer {
//
//    private final JwtTokenInterceptor jwtTokenInterceptor;
//
//    @Autowired
//    public InterceptorConfig(JwtTokenInterceptor jwtTokenInterceptor) {
//        this.jwtTokenInterceptor = jwtTokenInterceptor;
//    }
//
//    @Override
//    public void addInterceptors(InterceptorRegistry registry) {
//        // JWT 토큰 인터셉터 등록
//        registry.addInterceptor(jwtTokenInterceptor)
//
//                .excludePathPatterns("/api/auth/**");  // 제외할 URL 패턴 지정 (로그인 등 예외적으로 인증이 필요하지 않은 URL)
//    }
}
