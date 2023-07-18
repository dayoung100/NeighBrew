package com.ssafy.backend.controller;

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
    @GetMapping
    public ResponseEntity<List<User>> findAll() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/{accessToken}")
    public ResponseEntity<User> findByAccessToken(@PathVariable String accessToken) {
        Long userId = authTokensGenerator.extractUserId(accessToken);
        return ResponseEntity.ok(userRepository.findById(userId).get());
    }




//    @PostMapping
//    public ResponseEntity<User> registerUser(@RequestBody User user) {
//        User registeredUser = userService.registerUser(user);
//        return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
//    }
}
