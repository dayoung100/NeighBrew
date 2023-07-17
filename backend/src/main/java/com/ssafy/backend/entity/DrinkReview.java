package com.ssafy.backend.entity;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Where;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;

import javax.persistence.*;
import java.util.Date;

@Entity
@Getter
@Setter
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
}
