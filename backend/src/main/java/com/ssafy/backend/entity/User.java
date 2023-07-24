package com.ssafy.backend.entity;

import com.ssafy.backend.authentication.domain.oauth.OAuthProvider;
import com.ssafy.backend.dto.UserUpdateDto;
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
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false, unique = true, length = 50)
    private String email;

    @Column(nullable = false, unique = true, length = 20)
    private String nickname;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private OAuthProvider oAuthProvider;

    @Column(nullable = false, length = 20)
    private String name;

    @Column(nullable = false, length = 100)
    private String password;

    @Column(nullable = false, unique = true, length = 20)
    private String phone;

    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date birth;


    @Lob
    private String intro;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Column(nullable = false, columnDefinition = "float default 40.0")
    private Float liverPoint;

    @Column(nullable = false, columnDefinition = "varchar(255) default 'no image'")
    private String profile;

    @PrePersist
    public void prePersist() {
        this.liverPoint = 40.0f;
        this.profile = "no image";
    }


    @Builder
    public User(String email, String nickname, String name, OAuthProvider oAuthProvider) {
        this.email = email;
        this.nickname = nickname;
        this.name = name;
        this.oAuthProvider = oAuthProvider;
    }

    @Builder
    public User(Long userId, String email, String nickname, OAuthProvider oAuthProvider, String name, String password,
                String phone, Date birth, String intro, Float liverPoint, String profile) {
        this.userId = userId;
        this.email = email;
        this.nickname = nickname;
        this.oAuthProvider = oAuthProvider;
        this.name = name;
        this.password = password;
        this.phone = phone;
        this.birth = birth;
        this.intro = intro;
        this.liverPoint = liverPoint;
        this.profile = profile;
    }
    public void updateFromDto(UserUpdateDto updateDto) {
        if (updateDto.getNickname() != null) {
            this.nickname = updateDto.getNickname();
        }
        if (updateDto.getIntro() != null) {
            this.intro = updateDto.getIntro();
        }
        if (updateDto.getProfile() != null) {
            this.profile = updateDto.getProfile();
        }
        if (updateDto.getLiverPoint() != null) {
            this.liverPoint = updateDto.getLiverPoint();
        }
    }
}
