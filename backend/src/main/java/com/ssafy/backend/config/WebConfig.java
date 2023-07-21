package com.ssafy.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.annotation.PostConstruct;
import java.util.TimeZone;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // 모든 URL에 대해 CORS를 해제
        registry.addMapping("/**")
                .allowedOrigins("*") // 모든 Origin 허용 (본인의 도메인 주소를 지정하여도 됨)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 허용하는 HTTP 메서드 지정
                .allowedHeaders("*") // 모든 Header 허용
                .allowCredentials(false) // Credentials(Cookie, 인증 헤더 등) 허용 여부
                .maxAge(3600); // pre-flight 요청 결과를 캐시할 시간(초)

    }
}