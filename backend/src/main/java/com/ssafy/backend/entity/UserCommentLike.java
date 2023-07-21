package com.ssafy.backend.entity;

import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserCommentLike {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userCommentLikeId;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;

    @ManyToOne
    @JoinColumn(name = "reviewId")
    private DrinkReview drinkReview;

    @Builder
    public UserCommentLike(User user, DrinkReview drinkReview) {
        this.user = user;
        this.drinkReview = drinkReview;
    }
}

