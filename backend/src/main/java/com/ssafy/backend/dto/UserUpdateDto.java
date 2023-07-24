package com.ssafy.backend.dto;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserUpdateDto {
    private Long userId;
    private String nickname;
    private String intro;
    private String profile;
    private Float liverPoint;

    @Builder
    public UserUpdateDto(Long userId, String nickname, String intro, String profile, Float liverPoint) {
        this.userId = userId;
        this.nickname = nickname;
        this.intro = intro;
        this.profile = profile;
        this.liverPoint = liverPoint;
    }
}
