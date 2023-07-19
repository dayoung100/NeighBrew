package com.ssafy.backend.controller;

import com.ssafy.backend.authentication.application.OAuthLoginService;
import com.ssafy.backend.authentication.domain.AuthTokensGenerator;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.UserRepository;
import com.ssafy.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final AuthTokensGenerator authTokensGenerator;


    @Autowired
    public UserController(UserService userService, UserRepository userRepository, AuthTokensGenerator authTokensGenerator) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.authTokensGenerator = authTokensGenerator;
    }



    //전체 유저 검색
    @GetMapping
    public ResponseEntity<List<User>> findAll() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    //현재 유저 접속 유저를 accessToken으로 조회
    @GetMapping("/{accessToken}")
    public ResponseEntity<User> findByAccessToken(@PathVariable String accessToken) {
        Long userId = authTokensGenerator.extractUserId(accessToken);
        return ResponseEntity.ok(userRepository.findById(userId).get());
    }








}
