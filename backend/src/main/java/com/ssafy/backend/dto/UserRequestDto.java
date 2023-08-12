package com.ssafy.backend.dto;

import com.ssafy.backend.entity.User;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UserRequestDto {
    private String email;
    private String nickname;
    private String name;
    private LocalDate birth;
    private String intro;
    private Float liverPoint;
    private String profile;

    @Builder
    public UserRequestDto(String email, String nickname, String name,
                          LocalDate birth, String intro, Float liverPoint, String profile) {
        this.email = email;
        this.nickname = nickname;
        this.name = name;
        this.birth = birth;
        this.intro = intro;
        this.liverPoint = liverPoint;
        this.profile = profile;
    }

    public User toEntity() {
        return User.builder()
                .email(email)
                .nickname(nickname)
                .name(name)
                .birth(birth)
                .intro(intro)
                .liverPoint(liverPoint)
                .profile(profile)
                .build();
    }
}
