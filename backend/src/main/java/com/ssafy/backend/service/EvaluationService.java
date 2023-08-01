package com.ssafy.backend.service;

import com.ssafy.backend.dto.MeetUserDto;
import com.ssafy.backend.entity.MeetUser;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.MeetRepository;
import com.ssafy.backend.repository.MeetUserRepository;
import com.ssafy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EvaluationService {
    private final UserRepository userRepository;
    private final MeetUserRepository meetUserRepository;



    public User calculateScoreByMeetId(Long meetId, Long userId, String evaluation) {
        log.info("meetId : {}인 모임 정보 출력 ", meetId);

        List<MeetUser> meetUsers = meetUserRepository.findByMeet_MeetIdOrderByStatusDesc(meetId)
                .orElseThrow(() -> new IllegalArgumentException("모임 ID 값이 올바르지 않습니다."));

        int totalUsers = meetUsers.size();
        if (totalUsers <= 1) {
            throw new IllegalArgumentException("평가를 위한 유저 수가 부족합니다.");
        }


        float score = 0;


        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저 ID가 올바르지 않습니다."));

        float liverPoint = user.getLiverPoint();

        log.info(String.valueOf(liverPoint));

        if ("good".equalsIgnoreCase(evaluation)) {
            score = (float) (1.0 / totalUsers);
             user.setLiverPoint(liverPoint + score);
        } else if ("bed".equalsIgnoreCase(evaluation)) {
            score = (float) (2.0 / totalUsers);
            user.setLiverPoint(liverPoint - score);
        } else {
            throw new IllegalArgumentException("평가는 'good' 또는 'bed'로 입력해야 합니다.");
        }

        log.info(String.valueOf(liverPoint));

        return user;
    }



}
