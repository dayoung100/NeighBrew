package com.ssafy.backend.dto;

import com.ssafy.backend.entity.Drink;
import com.ssafy.backend.entity.DrinkReview;
import com.ssafy.backend.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DrinkReviewDto {
    private Long userId;
    private Long drinkId;
    private String content;
    private String img;

    public DrinkReview toEntity(User user, Drink drink) {
        return DrinkReview.builder()
                .user(user)
                .drink(drink)
                .content(content)
                .img(img)
                .build();
    }
}
