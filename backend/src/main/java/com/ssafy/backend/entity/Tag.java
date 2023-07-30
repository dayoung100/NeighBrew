package com.ssafy.backend.entity;

import lombok.Getter;

import javax.persistence.*;

@Entity
@Getter
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tagId;

    @Column(nullable = false, length = 20)
    private String name;
}
