package com.ssafy.backend.service;

import com.ssafy.backend.dto.MeetUserDto;
import com.ssafy.backend.dto.UserUpdateDto;
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



    // 유저 상호평가 점수 반영
    // 최대 1점 상승
    // 최대 3점 하락
    public String calculateScoreByMeetId(Long meetId, Long userId, String evaluation) {
        log.info("meetId : {}인 모임 정보 출력 ", meetId);

        List<MeetUser> meetUsers = meetUserRepository.findByMeet_MeetIdOrderByStatusDesc(meetId)
                .orElseThrow(() -> new IllegalArgumentException("모임 ID 값이 올바르지 않습니다."));

        int totalUsers = meetUsers.size() -1 ; // 본인제외
        if (totalUsers <= 1) {
            throw new IllegalArgumentException("평가를 위한 유저 수가 부족합니다.");
        }

        float score = 0;


        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저 ID가 올바르지 않습니다."));

        float liverPoint = user.getLiverPoint(); // 현재 유저의 간수치 저장


        if ("good".equalsIgnoreCase(evaluation)) {
            score = (float) (1.0 / totalUsers);
            float newLiverPoint = liverPoint + score;
            user.updateLiverPoint(newLiverPoint);
             log.info("good" + score);
        } else if ("bad".equalsIgnoreCase(evaluation)) {
            score = (float) (3.0 / totalUsers);
           // user.setLiverPoint(liverPoint - score);
            float newLiverPoint = liverPoint - score;
            user.updateLiverPoint(newLiverPoint);
            log.info("bad" + score);
        } else if ("mid".equalsIgnoreCase(evaluation)) {
            log.info("mid" + score);
        } else {
            throw new IllegalArgumentException("평가는 'good' 또는 'bad'로 입력해야 합니다.");
        }

        userRepository.save(user); // 변경된 객체 저장
        userRepository.flush();    // 변경 사항을 데이터베이스에 반영

        log.info(String.valueOf(liverPoint));

        return "성공적 반영";
    }



}
