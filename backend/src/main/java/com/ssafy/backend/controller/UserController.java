package com.ssafy.backend.controller;

import com.ssafy.backend.authentication.application.LoginResponse;
import com.ssafy.backend.dto.UserDto;
import com.ssafy.backend.dto.UserUpdateDto;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.UserRepository;
import com.ssafy.backend.service.UserService;
import com.ssafy.backend.util.JwtUtil;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor

@Slf4j
@RequestMapping("/user")
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;

    //전체 유저 검색
    @GetMapping()
    public ResponseEntity<List<User>> findAll() {
        return ResponseEntity.ok(userRepository.findAll());
    }


    @GetMapping("/guard/userinfo")
    public ResponseEntity<?> getUserInfo(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        User user = userRepository.findById(Long.valueOf(userId)).orElse(null);
        if (user != null) {
            return new ResponseEntity<>(new UserDto(user), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // refresh token을 이용한 access token 재발급
    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshAccessToken(@RequestBody LoginResponse refreshToken) {
        Claims claims;
        log.info("refreshToken + " + refreshToken.getRefreshToken());

        try {
            claims = JwtUtil.getClaims(refreshToken.getRefreshToken());
            log.info("claims + " + claims.toString());

            String userId = claims.getSubject();
            // 새로운 access 토큰 생성
            String newAccessToken = JwtUtil.generateToken(userId);
            String newRreshToken = JwtUtil.generateRefreshToken(userId);

            Map<String, String> tokens = new HashMap<>();
            tokens.put("accessToken", newAccessToken);
            tokens.put("refreshToken", newRreshToken);
            return ResponseEntity.ok(tokens);
        } catch (Exception e) {
            System.out.println("e.toString() = " + e.toString());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
        }
    }

    // Test용 일반 아이디 => 유저 아이디 넣으면 JWT 반환하는 코드 작성

    @GetMapping("/access-token/{userId}")
    public ResponseEntity<?> jwtMaker(@PathVariable Long userId) {
        String accessToken = JwtUtil.generateToken(String.valueOf(userId));
        String refreshToken = JwtUtil.generateRefreshToken(String.valueOf(userId));
        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);
        return ResponseEntity.ok(tokens);
    }

    @PutMapping("/guard")
    public ResponseEntity<?> updateUserInfo(@RequestBody UserUpdateDto userUpdateDto, HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        User updatedUser = userService.updateUser(Long.valueOf(userId), userUpdateDto);
        return ResponseEntity.ok(updatedUser);
    }
}
