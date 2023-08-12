package com.ssafy.backend.service;

import com.ssafy.backend.dto.UserResponseDto;
import com.ssafy.backend.dto.UserUpdateDto;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;

    public UserResponseDto findByUserId(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("유저 정보가 올바르지 않습니다."));
        return UserResponseDto.fromEntity(user);
    }

    @Transactional
    public UserResponseDto updateUser(Long userId, UserUpdateDto updateDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("유저 정보가 올바르지 않습니다."));

        if (userRepository.existsByNickname(updateDto.getNickname()) && !updateDto.getNickname().equals(user.getNickname())) {
            throw new IllegalArgumentException("닉네임 중복");
        }

        if (!userRepository.existsByNickname(updateDto.getNickname()) && updateDto.getNickname().equals(user.getNickname())
                && updateDto.getBirth().equals(user.getBirth()) && updateDto.getIntro().equals(user.getIntro())) {
            throw new IllegalArgumentException("변경 사항이 없습니다.");
        }

        user.updateFromDto(updateDto);

        return UserResponseDto.fromEntity(userRepository.save(user));
    }

    @Transactional
    public void updateUserImg(Long userId, String url) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("유저 정보가 올바르지 않습니다."));
        user.updateImg(url);
        userRepository.save(user);
    }


    public List<UserResponseDto> findAll() {
        List<User> users = userRepository.findAll();
        return users.stream().map(UserResponseDto::fromEntity).collect(Collectors.toList());
    }


    public List<UserResponseDto> searchUsers(String nickName) {
        List<User> users = userRepository.findByNicknameContaining(nickName);
        return users.stream().map(UserResponseDto::fromEntity).collect(Collectors.toList());
    }
}
