package com.ssafy.backend.dto;


import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDate;
import java.util.Date;

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
