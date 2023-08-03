package com.ssafy.backend.repository;

import com.ssafy.backend.entity.Evaluation;
import com.ssafy.backend.entity.Meet;
import com.ssafy.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EvaluationRepositroy extends JpaRepository<Evaluation, Long> {
    Optional<Evaluation> findByRatedUserAndReviewerAndMeetId(User ratedUser, User reviewer, Meet meetId);
}