package com.ssafy.backend.dto;

import com.ssafy.backend.entity.User;
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
    private Long drinkReviewId;
    private Long userId;
}
