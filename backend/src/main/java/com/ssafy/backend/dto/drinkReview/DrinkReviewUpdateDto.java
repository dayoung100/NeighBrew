package com.ssafy.backend.dto.drinkReview;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class DrinkReviewUpdateDto {
    private Long drinkReviewId;
    private String content;
    private String img;
}
