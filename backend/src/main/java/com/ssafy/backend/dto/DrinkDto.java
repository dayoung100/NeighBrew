package com.ssafy.backend.dto;

import com.ssafy.backend.entity.Drink;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class DrinkDto {
    private String name;
    private String image;
    private Float degree;
    private String description;
    private Long tagId;

    public Drink toEntity() {
        return Drink.builder()
                .name(name)
                .image(image)
                .degree(degree)
                .description(description)
                .tagId(tagId)
                .build();
    }
}
