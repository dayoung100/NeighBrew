package com.ssafy.backend.repository;

import com.ssafy.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;



public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

//    boolean existsByEmail(String email);
//
//    boolean existsByNickname(String nickname);
//
//    boolean existsByPhone(String phone);
}
