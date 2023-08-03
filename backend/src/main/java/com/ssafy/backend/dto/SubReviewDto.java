package com.ssafy.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubReviewDto {
    private Long subReviewId;
    private String content;
    private String createdAt;
    private Long reviewId;
    private Long userId;
}
