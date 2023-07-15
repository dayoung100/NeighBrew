package com.ssafy.backend.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue
    private Long userId;

    private String name;

    private String phone;

    @Temporal(TemporalType.DATE)
    private Date birth;

    private String nickname;

    @Lob
    private String intro;

    private Float iu;

    @Lob
    private String profile;
}
