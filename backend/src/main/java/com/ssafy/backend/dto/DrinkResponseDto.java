package com.ssafy.backend.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DrinkResponseDto {
    private Long drinkId;
    private String name;
    private String image;
    private Float degree;
    private String description;
    private Long tagId;
}