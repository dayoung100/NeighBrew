package com.ssafy.backend.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table
@Getter
@Setter
public class DrinkUserImage {
    @Id
    @GeneratedValue
    private Long drinkUserImageId;

    @Lob
    private String imageUrl;
}
