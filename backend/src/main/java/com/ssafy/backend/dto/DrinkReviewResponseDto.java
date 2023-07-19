package com.ssafy.backend.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class DrinkReviewResponseDto {
    private Long drinkReviewId;
    private Long userId;
    private String content;

    @Builder
    public DrinkReviewResponseDto(Long drinkReviewId, Long userId, String content) {
        this.drinkReviewId = drinkReviewId;
        this.userId = userId;
        this.content = content;
    }
}
