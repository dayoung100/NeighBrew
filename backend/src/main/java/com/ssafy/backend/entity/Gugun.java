package com.ssafy.backend.entity;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;

@Entity
@Getter
@IdClass(GugunPK.class)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Gugun {
    @Id
    @Column(name = "gugun_code")
    private Integer gugunCode;

    @Column(length = 30)
    private String gugunName;

    @Id
    @Column(name = "sido_code")
    private Integer sidoCode;
}
