package com.ssafy.backend.service;

import com.ssafy.backend.dto.EvaluationDto;
import com.ssafy.backend.dto.MeetUserDto;
import com.ssafy.backend.dto.UserUpdateDto;
import com.ssafy.backend.entity.Evaluation;
import com.ssafy.backend.entity.Meet;
import com.ssafy.backend.entity.MeetUser;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.EvaluationRepositroy;
import com.ssafy.backend.repository.MeetRepository;
import com.ssafy.backend.repository.MeetUserRepository;
import com.ssafy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class EvaluationService {
    private final UserRepository userRepository;
    private final MeetUserRepository meetUserRepository;
    private  final MeetRepository meetRepository;
    private  final  EvaluationRepositroy evaluationRepositroy;



    // 유저 상호평가 점수 반영
    // 최대 1점 상승
    // 최대 3점 하락
    @Transactional
    public String calculateScoreByMeetId(EvaluationDto evaluationDto, Long userId) {
        Long meetIdTemp = evaluationDto.getMeetId();
        String evaluationType = evaluationDto.getEvaluationType();
        Long reviewerId= evaluationDto.getReviewer();
        log.info("meetId : {}인 모임 정보 출력 ", meetIdTemp);

        if(userId == reviewerId){
            throw new IllegalArgumentException("자기 자신을 평가 할 수 없습니다.");
        }

        User ratedUser = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("Rated User not found"));
        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new IllegalStateException("Reviewer not found"));
        Meet meetId = meetRepository.findById(evaluationDto.getMeetId())
            .orElseThrow(() -> new IllegalStateException("Reviewer not found"));
        // 이미 평가한거면 멈춰
        // 현재 아이디로 현재 현재 모임에  같은 유저를 평가한 적이 있으면 오류 발생

        Optional<Evaluation> existingEvaluation = evaluationRepositroy
                .findByRatedUserAndReviewerAndMeetId(ratedUser, reviewer, meetId);
        if (existingEvaluation.isPresent()) {
            throw new IllegalArgumentException("이미 평가한 유저 입니다.");
        }

        List<MeetUser> meetUsers = meetUserRepository.findByMeet_MeetIdOrderByStatusDesc(meetIdTemp)
                .orElseThrow(() -> new IllegalArgumentException("모임 ID 값이 올바르지 않습니다."));

        int totalUsers = meetUsers.size() -1 ; // 본인제외
        if (totalUsers <= 1) {
            throw new IllegalArgumentException("평가 가능한 유저가 없습니다.");
        }

        float score = 0;


        User user = userRepository.findById(reviewerId)
                .orElseThrow(() -> new IllegalArgumentException("유저 ID가 올바르지 않습니다."));

        float liverPoint = user.getLiverPoint(); // 현재 유저의 간수치 저장

        log.info(String.valueOf(user.getLiverPoint()));

        if ("good".equalsIgnoreCase(evaluationType)) {
            score = (float) (1.0 / totalUsers);
            float newLiverPoint = liverPoint + score;
            user.updateLiverPoint(newLiverPoint);
             log.info("good" + score);
        } else if ("bad".equalsIgnoreCase(evaluationType)) {
            score = (float) (3.0 / totalUsers);
           // user.setLiverPoint(liverPoint - score);
            float newLiverPoint = liverPoint - score;
            user.updateLiverPoint(newLiverPoint);
            log.info("bad" + score);
        } else if ("mid".equalsIgnoreCase(evaluationType)) {
            log.info("mid" + score);
        } else {
            throw new IllegalArgumentException("평가는 'good' 또는 'bad'로 입력해야 합니다.");
        }

        log.info(String.valueOf(user.getLiverPoint()));

        userRepository.save(user); // 변경된 객체 저장
        userRepository.flush();    // 변경 사항을 데이터베이스에 반영

        Evaluation evaluation = evaluationDto.toEntity(userRepository, meetRepository, userId);
        evaluationRepositroy.save(evaluation);



        return "성공적으로 반영되었습니다.";
    }



}
