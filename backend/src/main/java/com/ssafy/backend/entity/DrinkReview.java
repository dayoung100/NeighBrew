package com.ssafy.backend.entity;

import com.ssafy.backend.dto.DrinkReviewDto;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Where;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;

import javax.persistence.*;
import java.util.Date;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Where(clause = "deleted = false")
public class DrinkReview {
    @Id
    @GeneratedValue
    private Long drinkReviewId;


    @Lob
    private String content;

    @Lob
    @Column(nullable = false, columnDefinition = "TEXT default 'no image'")
    private String image;

    @CreatedDate
    private Date createdAt;

    @LastModifiedBy
    private Date updatedAt;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;

    @ManyToOne
    @JoinColumn(name = "drinkId")
    private Drink drink;

    private boolean deleted = false;

    @Builder
    public DrinkReview(Long drinkReviewId, String content, String image, Date createdAt, Date updatedAt, User user, Drink drink) {
        this.drinkReviewId = drinkReviewId;
        this.content = content;
        this.image = image;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.user = user;
        this.drink = drink;
    }

    public void update(DrinkReviewDto drinkReviewDto) {
        this.content = drinkReviewDto.getContent();
        this.image = drinkReviewDto.getImage();
        this.updatedAt = new Date();
    }
}

