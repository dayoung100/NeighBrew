package com.ssafy.backend.dto;

import com.ssafy.backend.entity.Drink;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor

public class DrinkUpdateResponseDto {
    private Long drinkId;
    private String name;
    private String image;
    private Float degree;
    private String description;
    private Long tagId;

    @Builder
    public DrinkUpdateResponseDto(Long drinkId, String name, String image, Float degree, String description, Long tagId) {
        this.drinkId = drinkId;
        this.name = name;
        this.image = image;
        this.degree = degree;
        this.description = description;
        this.tagId = tagId;
    }

    public static DrinkUpdateResponseDto fromEntity(Drink drink) {
        return DrinkUpdateResponseDto.builder()
                .drinkId(drink.getDrinkId())
                .name(drink.getName())
                .image(drink.getImage())
                .degree(drink.getDegree())
                .description(drink.getDescription())
                .tagId(drink.getTagId())
                .build();
    }
}
