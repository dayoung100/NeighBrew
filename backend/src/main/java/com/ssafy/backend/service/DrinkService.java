package com.ssafy.backend.service;

import com.ssafy.backend.entity.Drink;
import com.ssafy.backend.repository.DrinkRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class DrinkService {
    private final DrinkRepository drinkRepository;

    public DrinkService(DrinkRepository drinkRepository) {
        this.drinkRepository = drinkRepository;
    }

    // 모든 술 조회
    public Page<Drink> findAll(Pageable pageable) {
        return drinkRepository.findAll(pageable);
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


    public Page<Drink> findByNameAndTag(String name, Long tag, Pageable pageable) {
        // 이름이 비어있다면
        if (name == null || name.equals("")) {
            // 태그가 비어있다면
            if (tag == null) {
                // 모든 술 조회
                return drinkRepository.findAll(pageable);
            }
            // 태그가 있다면
            else {
                // 태그로 조회
                return drinkRepository.findAllByTagId(tag, pageable);
            }
        }
        // 이름이 있다면
        else {
            // 태그가 비어있다면
            if (tag == null) {
                // 이름으로 조회
                return drinkRepository.findAllByNameContaining(name, pageable);
            }
            // 태그가 있다면
            else {
                // 이름과 태그로 조회
                return drinkRepository.findByNameContainingAndTagId(name, tag, pageable);
            }
        }
    }
}
