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
    private String name;
    @Lob
    private String image;
    private Float degree;
    @Lob
    private String description;
}
