package com.ssafy.backend.dto;

import com.ssafy.backend.entity.Drink;
import com.ssafy.backend.entity.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DrinkReviewDto {
    private Long drinkReviewId;
    private String content;
    private String image;
    private Drink drink;
    private User user;
}
