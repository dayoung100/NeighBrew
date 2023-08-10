package com.ssafy.backend.dto;

import com.ssafy.backend.entity.User;
import lombok.Builder;
import lombok.Getter;

@Getter
public class SubReviewResponseDto {
    private Long subReviewId;
    private String content;
    private User user; // User 정보를 포함하기 위해

    @Builder
    public SubReviewResponseDto(Long subReviewId, String content, User user) {
        this.subReviewId = subReviewId;
        this.content = content;
        this.user = user;
    }
}
