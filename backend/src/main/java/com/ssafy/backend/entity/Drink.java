package com.ssafy.backend.entity;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Drink {
    @Id
    @GeneratedValue
    private Long drinkId;

    @Column(nullable = false, unique = true, length = 20)
    private String name;

    @Column(nullable = false, columnDefinition = "varchar(255) default 'no image'")
    private String image = "no image";

    @Column(nullable = false, columnDefinition = "float default 0.0")
    private Float degree = 0.0f;

    @Lob
    private String description;

    // 주종 태그 id
    private Long tagId;

    @PrePersist
    public void prePersist() {
        if (this.image == null) this.image = "no image";
        if (this.degree == null) this.degree = 0.0f;
    }


    @Builder
    public Drink(String name, String image, Float degree, String description) {
        this.name = name;
        this.image = image;
        this.degree = degree;
        this.description = description;
    }

    public void update(String name, String image, Float degree, String description) {
        this.name = name;
        this.image = image;
        this.degree = degree;
        this.description = description;
    }
}
