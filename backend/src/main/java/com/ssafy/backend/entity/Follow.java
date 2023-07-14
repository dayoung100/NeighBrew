package com.ssafy.backend.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table
@Getter
@Setter
public class Follow {
    @Id
    @GeneratedValue
    private Long followId;

    @ManyToOne
    @JoinColumn(name = "followerId")
    private User followerId;

    @ManyToOne
    @JoinColumn(name = "followingId")
    private User followingId;
}
