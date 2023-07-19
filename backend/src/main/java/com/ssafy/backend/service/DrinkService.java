package com.ssafy.backend.service;

import com.ssafy.backend.entity.Drink;
import com.ssafy.backend.repository.DrinkRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class DrinkService {
    private final DrinkRepository drinkRepository;

    public DrinkService(DrinkRepository drinkRepository) {
        this.drinkRepository = drinkRepository;
    }

    // 모든 술 조회
    public List<Drink> findAll() {
        return drinkRepository.findAll();
    }

    // 술 이름으로 조회
    public List<Drink> findByNameContaining(String name) {
        return drinkRepository.findAllByNameContaining(name).orElseThrow(() -> new IllegalArgumentException("해당 술이 없습니다."));
    }

    // 술 추가
    public Drink save(Drink drink) {
        if (drink.getName().equals("")) throw new IllegalArgumentException("술 이름이 없습니다.");
        return drinkRepository.save(drink);
    }

    // 술 삭제
    public void delete(Long drinkId) {
        drinkRepository.deleteByDrinkId(drinkId).orElseThrow(() -> new IllegalArgumentException("해당 술이 없습니다."));
    }

    // 술 수정
    public Drink update(Long id, Drink drink) {
        Drink findDrink = drinkRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("해당 술이 없습니다."));
        findDrink.update(drink.getName(), drink.getImage(), drink.getDegree(), drink.getDescription());

        return drinkRepository.save(findDrink);
    }


    public Object findByNameAndTag(String name, Long tag) {
        return drinkRepository.findByNameContainingAndTagId(name, tag);
    }
}
