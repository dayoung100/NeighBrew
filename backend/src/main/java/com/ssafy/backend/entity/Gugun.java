package com.ssafy.backend.entity;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Gugun {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer gugunCode;

    @Column(length = 30)
    private String gugunName;

    private Integer sidoCode;
}
