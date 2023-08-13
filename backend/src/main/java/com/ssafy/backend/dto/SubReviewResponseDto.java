package com.ssafy.backend.dto;

import com.ssafy.backend.entity.SubReview;
import lombok.Builder;
import lombok.Getter;

@Getter
public class SubReviewResponseDto {
    private Long subReviewId;
    private String content;
    private UserResponseDto user; // User 정보를 포함하기 위해

    @Builder
    public SubReviewResponseDto(Long subReviewId, String content, UserResponseDto user) {
        this.subReviewId = subReviewId;
        this.content = content;
        this.user = user;
    }

    public static SubReviewResponseDto fromEntity(SubReview subReview) {
        return SubReviewResponseDto.builder()
                .subReviewId(subReview.getSubReviewId())
                .content(subReview.getContent())
                .user(UserResponseDto.fromEntity(subReview.getUser()))
                .build();
    }
}
