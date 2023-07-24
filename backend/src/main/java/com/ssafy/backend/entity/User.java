package com.ssafy.backend.entity;

import com.ssafy.backend.authentication.domain.oauth.OAuthProvider;
import lombok.*;
import org.hibernate.annotations.Where;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Where(clause = "deleted = false")
public class User {
    // 최조 로그인 시 기본 정보를 가져와야함
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = true, unique = true, length = 50)
    private String email;

    @Column(nullable = true, unique = true, length = 20)
    private String nickname;

    @Column(nullable = true)
    @Enumerated(EnumType.STRING)
    private OAuthProvider oAuthProvider;

    @Column(nullable = true, length = 20)
    private String name;

    @Column(nullable = true, length = 100)
    private String password;

    @Column(nullable = true, unique = true, length = 20)
    private String phone;

    @Temporal(TemporalType.DATE)
    @Column(nullable = true)
    private Date birth;


    @Lob
    private String intro;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Column(nullable = true, columnDefinition = "float default 40.0")
    private Float iu;

    @Column(nullable = true, columnDefinition = "varchar(255) default 'no image'")
    private String profile;

    private boolean deleted = false;


    @Builder
    public User(String email, String nickname, String name, OAuthProvider oAuthProvider) {
        this.email = email;
        this.nickname = nickname;
        this.name = name;
        this.oAuthProvider = oAuthProvider;
    }
}
