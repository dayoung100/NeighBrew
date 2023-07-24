package com.ssafy.backend.dto;

import com.ssafy.backend.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
public class UserDto {
    private Long userId;

    private String email;

    private String nickname;

    private String name;

    private Date birth;

    private String intro;

    private Float liverPoint;

    private String profile;

    public UserDto(User user) {
        this.userId = user.getUserId();
        this.email = user.getEmail();
        this.nickname = user.getNickname();
        this.name = user.getName();
        this.birth = user.getBirth();
        this.intro = user.getIntro();
        this.liverPoint = user.getLiverPoint();
        this.profile = user.getProfile();
    }
}
