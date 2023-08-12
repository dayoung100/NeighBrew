package com.ssafy.backend.dto;


import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;


@Getter
@Setter
public class UserUpdateDto extends UserRequestDto {
    public UserUpdateDto(String email, String nickname, String name, LocalDate birth, String intro, Float liverPoint, String profile) {
        super(email, nickname, name, birth, intro, liverPoint, profile);
    }
}
