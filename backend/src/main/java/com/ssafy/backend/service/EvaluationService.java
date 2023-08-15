package com.ssafy.backend.service;

import com.ssafy.backend.dto.evaluation.EvaluationRequestDto;
import com.ssafy.backend.entity.Evaluation;
import com.ssafy.backend.entity.Meet;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.EvaluationRepositroy;
import com.ssafy.backend.repository.MeetRepository;
import com.ssafy.backend.repository.MeetUserRepository;
import com.ssafy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class EvaluationService {
    private final UserRepository userRepository;
    private final MeetUserRepository meetUserRepository;
    private final MeetRepository meetRepository;
    private final EvaluationRepositroy evaluationRepositroy;

    private static final String EVALUATION_ERR_SELF = "자기 자신을 평가 할 수 없습니다.";
    private static final String ERR_NOT_FOUND = "%s를 찾을 수 없습니다.";
    private static final String ERR_ALREADY_EVALUATED = "이미 평가한 유저 입니다.";
    private static final String ERR_INVALID_MEET_ID = "모임 ID 값이 올바르지 않습니다.";
    private static final String ERR_NO_USERS = "평가 가능한 유저가 없습니다.";
    private static final String ERR_INVALID_EVAL_TYPE = "평가는 'good' 또는 'bad' 또는 'mid'로 입력해야 합니다.";

    @Transactional
    public String calculateScoreByMeetId(EvaluationRequestDto evaluationRequestDto, Long userId) {
        verifySelfEvaluation(evaluationRequestDto, userId);

        User ratedUser = userRepository.findById(userId).orElseThrow(
                () -> new IllegalStateException(String.format(ERR_NOT_FOUND, "ratedUser"))
        );
        User reviewer = userRepository.findById(evaluationRequestDto.getReviewer()).orElseThrow(
                () -> new IllegalStateException(String.format(ERR_NOT_FOUND, "reviewer"))
        );
        Meet meet = meetRepository.findById(evaluationRequestDto.getMeetId()).orElseThrow(
                () -> new IllegalStateException(String.format(ERR_NOT_FOUND, "meet"))
        );

        checkExistingEvaluation(ratedUser, reviewer, meet);

        Long totalUsers = meetUserRepository.countByMeet_MeetId(evaluationRequestDto.getMeetId()).orElseThrow(
                () -> new IllegalArgumentException(ERR_INVALID_MEET_ID)
        );

        verifyValidUserCount(totalUsers);

        updateReviewerScore(reviewer, evaluationRequestDto.getEvaluationType(), totalUsers);

        userRepository.save(reviewer);
        evaluationRepositroy.save(evaluationRequestDto.toEntity(ratedUser, meet));

        return "성공적으로 반영되었습니다.";
    }

    private void verifySelfEvaluation(EvaluationRequestDto evaluationRequestDto, Long userId) {
        if (Objects.equals(userId, evaluationRequestDto.getReviewer())) {
            throw new IllegalArgumentException(EVALUATION_ERR_SELF);
        }
    }

    private void checkExistingEvaluation(User ratedUser, User reviewer, Meet meet) {
        Optional<Evaluation> existingEvaluation = evaluationRepositroy.findByRatedUserAndReviewerAndMeet(ratedUser, reviewer, meet);
        if (existingEvaluation.isPresent()) {
            throw new IllegalArgumentException(ERR_ALREADY_EVALUATED);
        }
    }

    private void verifyValidUserCount(Long count) {
        if (count <= 1L) {
            throw new IllegalArgumentException(ERR_NO_USERS);
        }
    }

    private void updateReviewerScore(User reviewer, String evaluationType, Long totalUsers) {
        float score;
        switch (evaluationType.toLowerCase()) {
            case "good":
                score = 1.0f / totalUsers;
                reviewer.updateLiverPoint(reviewer.getLiverPoint() + score);
                break;
            case "bad":
                score = 3.0f / totalUsers;
                reviewer.updateLiverPoint(reviewer.getLiverPoint() - score);
                break;
            case "mid":
                break;
            default:
                throw new IllegalArgumentException(ERR_INVALID_EVAL_TYPE);
        }
    }
}
