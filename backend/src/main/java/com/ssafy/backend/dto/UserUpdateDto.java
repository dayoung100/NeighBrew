package com.ssafy.backend.dto;


import lombok.*;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserUpdateDto {
    private Long userId;
    private String nickname;
    private String intro;
    private String profile;
    private LocalDate birth;
    private Float liverPoint;
}
