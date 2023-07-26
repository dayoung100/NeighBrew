package com.ssafy.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DrinkUpdateDto {
    private String name;
    private String image;
    private Float degree;
    private String description;
    private Long tagId;
}
