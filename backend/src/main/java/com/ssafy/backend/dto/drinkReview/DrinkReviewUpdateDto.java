package com.ssafy.backend.dto.drinkReview;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DrinkReviewUpdateDto {
    private Long drinkReviewId;
    private String content;
    private String img;
}
