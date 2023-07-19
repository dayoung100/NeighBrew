package com.ssafy.backend.dto;

import com.ssafy.backend.entity.Drink;
import com.ssafy.backend.entity.DrinkReview;
import com.ssafy.backend.entity.User;
import lombok.*;

import java.util.Date;

@Getter
@Setter
public class DrinkReviewDto {
    private Long drinkReviewId;
    private String content;
    private String image;
    private Date createdAt;
    private Date updatedAt;
    private User user;
    private Drink drink;

    public DrinkReview toEntity() {
        return DrinkReview.builder()
                .drinkReviewId(drinkReviewId)
                .content(content)
                .image(image)
                .createdAt(createdAt)
                .updatedAt(updatedAt)
                .user(user)
                .drink(drink)
                .build();
    }
}
