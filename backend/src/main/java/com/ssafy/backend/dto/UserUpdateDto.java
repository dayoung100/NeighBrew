package com.ssafy.backend.dto;


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;


@Getter
@Setter
@ToString
public class UserUpdateDto {
    String email;
    String nickname;
    String name;
    LocalDate birth;
    String intro;
    Float liverPoint;
    String profile;
}
