package com.ssafy.backend.entity;

import lombok.Getter;

import javax.persistence.*;

@Entity
@Getter
@Table(name = "drink_festival")
public class Festival {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long drinkFestivalId;

    @Column(length = 50)
    private String name;

    @Column(length = 255)
    private String image;

    @Column(length = 255)
    private String redirectUri;



}
