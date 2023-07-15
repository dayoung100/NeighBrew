package com.ssafy.backend.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
public class Tag {
    @Id
    @GeneratedValue
    private Long tagId;

    @Column(nullable = false, length = 20)
    private String name;
}
