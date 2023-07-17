package com.ssafy.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DrinkDto {
    private long drinkId;
    private String name;
    private String image;
    private float degree;
    private String description;
}
