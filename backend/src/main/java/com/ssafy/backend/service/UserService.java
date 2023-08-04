package com.ssafy.backend.service;

import com.ssafy.backend.dto.UserUpdateDto;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.FollowRepository;
import com.ssafy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final FollowRepository followRepository;

    @Value("${oauth.kakao.client-id}")
    private String clientId;

    @Value("${oauth.kakao.url.auth}")
    private String authUrl;



    public String redirectApiUrl() {
        String redirectUri = "http://localhost:8080/kakao/callback";
        String responseType = "code";
        String Url = authUrl + "/oauth/authorize" + "?client_id=" + clientId + "&redirect_uri=" + redirectUri + "&response_type=" + responseType;

        return Url;
    }

    public User findByUserId(Long userId) {
        return userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("유저 정보가 올바르지 않습니다."));
    }

    @Transactional
    public User updateUser(Long userId, UserUpdateDto updateDto) {
        log.info(String.valueOf(updateDto.getBirth()));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("유저 정보가 올바르지 않습니다."));
        User temp = userRepository.findByNickname(updateDto.getNickname());
        if(temp != null){
            // 3개가 다 변화가 없으면 안보냄
            // 닉네임이 변경되는 경우
            // 닉네임은 변경 안되는데 생년월일이나 인트로가 다른 경우
            // 생년월일만 변경
            // 인트로만 변경
            // 이름만 변경
            if(temp.getNickname().equals(updateDto.getNickname())){
                if(!temp.getBirth().equals(updateDto.getBirth()) || !temp.getIntro().equals(updateDto.getIntro())) {

                }else {
                    throw new IllegalArgumentException("중복.");
                }
            }
        }

        user.updateFromDto(updateDto);

        return userRepository.save(user);
    }

    @Transactional
    public User updateUserImg(Long userId, String url) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("유저 정보가 올바르지 않습니다."));
        user.updateImg(url);
        return userRepository.save(user);
    }




    public List<User> findAll() {
        return userRepository.findAll();
    }

    public List<Optional<User>>searchUsers(String nickName){
            log.info(nickName);
            // 해당 이름을 가지고있는 데이터를 가져옴
            return userRepository.findByNicknameContaining(nickName);
        }



}
