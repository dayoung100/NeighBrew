package com.ssafy.backend.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
public class DrinkUserImage {
    @Id
    @GeneratedValue
    private Long drinkUserImageId;

    @Column(nullable = false, length = 20)
    private String imageUrl;
}
