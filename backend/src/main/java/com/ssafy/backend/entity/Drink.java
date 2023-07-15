package com.ssafy.backend.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
public class Drink {
    @Id
    @GeneratedValue
    private Long drinkId;

    @Column(nullable = false, unique = true, length = 20)
    private String name;

    @Column(nullable = false, columnDefinition = "varchar(255) default 'no image'")
    private String image;

    @Column(nullable = false, columnDefinition = "float default 0.0")
    private Float degree;

    @Lob
    private String description;
}
