package com.ssafy.backend.dto;

import com.ssafy.backend.entity.Drink;
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


    public Drink toEntity() {
        return Drink.builder()
                .name(name)
                .image(image)
                .degree(degree)
                .description(description)
                .build();
    }

    // update
    public Drink updateEntity(Drink drink) {
       return drink.update(name, image, degree, description);
    }
}
