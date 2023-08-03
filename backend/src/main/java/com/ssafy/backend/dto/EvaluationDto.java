package com.ssafy.backend.dto;

import com.ssafy.backend.Enum.EvaluationType;
import com.ssafy.backend.entity.Evaluation;
import com.ssafy.backend.repository.MeetRepository;
import com.ssafy.backend.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationDto {
    private Long reviewer;
    private Long meetId;
    private String evaluationType;
    private String description;

    public Evaluation toEntity(UserRepository userRepository, MeetRepository meetRepository, Long userId) {
        Evaluation evaluation = new Evaluation();
        evaluation.setRatedUser(userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found")));
        evaluation.setReviewer(userRepository.findById(reviewer).orElseThrow(() -> new IllegalArgumentException("User not found")));
        evaluation.setMeetId(meetRepository.findById(meetId).orElseThrow(() -> new IllegalArgumentException("Meet not found")));
        evaluation.setEvaluationType(EvaluationType.valueOf(evaluationType));
        evaluation.setDescription(description);

        return evaluation;
    }

}
