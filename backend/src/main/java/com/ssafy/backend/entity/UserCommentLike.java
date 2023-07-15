package com.ssafy.backend.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
public class UserCommentLike {
    @Id
    @GeneratedValue
    private Long userCommentLikeId;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;

    @ManyToOne
    @JoinColumn(name = "reviewId")
    private DrinkReview drinkReview;
}
