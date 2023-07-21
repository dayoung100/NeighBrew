package com.ssafy.backend.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
public class Follow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long followId;

    @ManyToOne
    @JoinColumn(name = "followerId")
    private User follower;

    @ManyToOne
    @JoinColumn(name = "followingId")
    private User following;
}
