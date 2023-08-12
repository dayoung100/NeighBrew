package com.ssafy.backend.dto.drinkReview;

import lombok.Getter;

@Getter
public class DrinkReviewUpdateDto {
    private Long drinkReviewId;
    private String content;
    private String img;
}
