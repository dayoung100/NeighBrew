//package com.ssafy.backend.authentication.infra;
//
//import io.jsonwebtoken.Claims;
//import io.jsonwebtoken.ExpiredJwtException;
//import io.jsonwebtoken.Jwts;
//import io.jsonwebtoken.SignatureAlgorithm;
//import io.jsonwebtoken.io.Decoders;
//import io.jsonwebtoken.security.Keys;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Component;
//
//import java.security.Key;
//import java.util.Date;
//
//@Component
//public class JwtTokenProvider {
//
//    private static Key key = null;
//
//    public JwtTokenProvider(@Value("${jwt.secret-key}") String secretKey) {
//        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
//        key = Keys.hmacShaKeyFor(keyBytes);
//    }
//
//
//    static public String generate(String subject, Date expiredAt) {
//        return Jwts.builder().setSubject(subject).setExpiration(expiredAt).signWith(key, SignatureAlgorithm.HS512).compact();
//    }
//
//
//    // 검증로직을 실행하는 메서드
//    // 성공하면 subJect를 반환
//    public String extractSubject(String accessToken) {
//        Claims claims = parseClaims(accessToken);
//
//        // 토큰의 만료 시간 검증
//        Date expirationDate = claims.getExpiration();
//        Date now = new Date();
//        if (now.after(expirationDate)) {
//            throw new InvalidTokenException("만료된 토큰입니다");
//        }
//
//        return claims.getSubject();
//    }
//
//
//    // accessToken을 보내면 해당 토큰이 정상인지 검증
//    static public Claims parseClaims(String accessToken) {
//        try {
//            return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(accessToken).getBody();
//        } catch (ExpiredJwtException e) {
//            return e.getClaims();
//        }
//    }
//
//
//    static public boolean tokenCheck(String accessToken) {
//        Claims claims = parseClaims(accessToken);
//
//        // 토큰의 만료 시간 검증
//        Date expirationDate = claims.getExpiration();
//        Date now = new Date();
//        return !now.after(expirationDate);
//    }
//}
//
