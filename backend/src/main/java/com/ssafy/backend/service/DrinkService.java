package com.ssafy.backend.service;

import com.ssafy.backend.dto.DrinkDto;
import com.ssafy.backend.entity.Drink;
import com.ssafy.backend.repository.DrinkRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DrinkService {
    private final DrinkRepository drinkRepository;

    public DrinkService(DrinkRepository drinkRepository) {
        this.drinkRepository = drinkRepository;
    }

    public Drink registDrink(DrinkDto drinkDto) {
        // 이름 중복 체크
        drinkRepository.findByName(drinkDto.getName()).ifPresent(drink -> {
            throw new IllegalArgumentException("이미 존재하는 이름입니다.");
        });

        Drink drink = drinkDto.toEntity();

        return drinkRepository.save(drink);
    }

    public void deleteDrink(Long drinkId) {
        Drink drink = drinkRepository.findById(drinkId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 음료입니다."));
        drink.setDeleted(true);
        drinkRepository.save(drink);
    }

    public Drink getDrink(Long drinkId) {
        return drinkRepository.findById(drinkId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 음료입니다."));
    }

    public List<Drink> getDrinkList() {
        return drinkRepository.findAll();
    }

    public Drink updateDrink(Long drinkId, DrinkDto drinkDto) {
        Drink drink = drinkRepository.findById(drinkId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 음료입니다."));
        drink = drinkDto.updateEntity(drink);
        return drinkRepository.save(drink);
    }
}
