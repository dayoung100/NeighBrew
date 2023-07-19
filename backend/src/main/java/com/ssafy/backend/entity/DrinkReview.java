package com.ssafy.backend.entity;

import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DrinkReview {
    @Id
    @GeneratedValue
    private Long drinkReviewId;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;

    @ManyToOne
    @JoinColumn(name = "drinkId")
    private Drink drink;

    @Lob
    private String content;

    @Builder
    public DrinkReview(Long drinkReviewId, User user, Drink drink, String content) {
        this.drinkReviewId = drinkReviewId;
        this.user = user;
        this.drink = drink;
        this.content = content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
