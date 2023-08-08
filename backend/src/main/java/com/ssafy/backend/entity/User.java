package com.ssafy.backend.entity;

import com.ssafy.backend.authentication.domain.oauth.OAuthProvider;
import com.ssafy.backend.dto.UserChatDto;
import com.ssafy.backend.dto.UserDto;
import com.ssafy.backend.dto.UserUpdateDto;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false, unique = true, length = 50)
    private String email;

    @Column(nullable = false, unique = true)
    private String nickname;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private OAuthProvider oAuthProvider;

    @Column(nullable = false, length = 20)
    private String name;


    private LocalDate birth;


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
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }


    @Builder
    public User(String email, String nickname, String name, Float liverPoint, OAuthProvider oAuthProvider) {
        this.email = email;
        this.nickname = nickname;
        this.liverPoint = liverPoint;
        this.name = name;
        this.oAuthProvider = oAuthProvider;
    }

    @Builder
    public User(Long userId, String email, String nickname, OAuthProvider oAuthProvider, String name,
                LocalDate birth, String intro, Float liverPoint, String profile) {
        this.userId = userId;
        this.email = email;
        this.nickname = nickname;
        this.oAuthProvider = oAuthProvider;
        this.name = name;
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

        if (updateDto.getBirth() != null) {
            this.birth = updateDto.getBirth();
        }

        if (updateDto.getProfile() != null) {
            this.profile = updateDto.getProfile();
        }
        if (updateDto.getLiverPoint() != null) {
            this.liverPoint = updateDto.getLiverPoint();
        }
    }

    public void updateImg(String url) {
        this.profile = url;
    }

    public void updateLiverPoint(Float newLiverPoint) {
        this.liverPoint = newLiverPoint;
    }

    public UserDto toUserDto() {
        return UserDto.builder()
                .userId(userId)
                .email(email)
                .nickname(nickname)
                .name(name)
                .birth(birth)
                .intro(intro)
                .liverPoint(liverPoint)
                .profile(profile)
                .build();
    }

    public UserChatDto toChatDto(){
        return UserChatDto.builder()
                .userId(userId)
                .email(email)
                .nickname(nickname)
                .name(name)
                .intro(intro)
                .liverPoint(liverPoint)
                .profile(profile)
                .build();
    }
}
