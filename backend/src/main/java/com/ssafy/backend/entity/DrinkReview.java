package com.ssafy.backend.entity;

import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DrinkReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long drinkReviewId;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;

    @ManyToOne
    @JoinColumn(name = "drinkId")
    private Drink drink;

    @Lob
    private String content;

    @Column(columnDefinition = "varchar(255) default 'no image'")
    private String img;

    @Builder
    public DrinkReview(Long drinkReviewId, User user, Drink drink, String content, String img) {
        this.drinkReviewId = drinkReviewId;
        this.user = user;
        this.drink = drink;
        this.img = img;
        this.content = content;
    }

    @PrePersist
    public void prePersist() {
        this.img = "no image";
    }

    public void setContent(String content) {
        this.content = content;
    }
}
