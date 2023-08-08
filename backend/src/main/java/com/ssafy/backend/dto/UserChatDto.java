package com.ssafy.backend.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class UserChatDto {
    private Long userId;

    private String email;

    private String nickname;

    private String name;

    private String intro;

    private Float liverPoint;

    private String profile;
    @Builder
    public UserChatDto(Long userId, String email, String nickname, String name, String intro, Float liverPoint, String profile) {
        this.userId = userId;
        this.email = email;
        this.nickname = nickname;
        this.name = name;
        this.intro = intro;
        this.liverPoint = liverPoint;
        this.profile = profile;
    }
}
