package com.ssafy.backend.entity;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Where;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Getter
@Setter
@Where(clause = "deleted = false")
public class User {
    @Id
    @GeneratedValue
    private Long userId;

    @Column(nullable = false, length = 20)
    private String name;

    @Column(nullable = false, unique = true, length = 50)
    private String email;

    @Column(nullable = false, length = 100)
    private String password;

    @Column(nullable = false, unique = true, length = 20)
    private String phone;

    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date birth;

    @Column(nullable = false, unique = true, length = 20)
    private String nickname;

    @Lob
    private String intro;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Column(nullable = false, columnDefinition = "float default 40.0")
    private Float iu;

    @Column(nullable = false, columnDefinition = "varchar(255) default 'no image'")
    private String profile;

    private boolean deleted = false;
}
