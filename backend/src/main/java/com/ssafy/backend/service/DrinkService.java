package com.ssafy.backend.service;

import com.ssafy.backend.dto.DrinkUpdateDto;
import com.ssafy.backend.entity.Drink;
import com.ssafy.backend.entity.DrinkReview;
import com.ssafy.backend.repository.DrinkRepository;
import com.ssafy.backend.repository.DrinkReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class DrinkService {
    private final DrinkRepository drinkRepository;
    private final DrinkReviewRepository drinkReviewRepository;


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
    public Drink updateDrink(Long drinkId, DrinkUpdateDto drinkUpdateDto) {
        Drink drink = findById(drinkId);
        drink.updateDrink(drinkUpdateDto);
        return drinkRepository.save(drink);
    }

    public Drink findById(Long drinkId) {
        return drinkRepository.findById(drinkId).orElseThrow(() -> new IllegalArgumentException("해당 술이 없습니다."));
    }

    // 이름과 태그로 술조회
    // 이름이 없다면 태그로만 조회
    // 태그가 없다면 이름으로 조회
    // 결과가 없다면 null을 반환
    public Page<Drink> findDrinkByName(String name, Long tagId, Pageable pageable) {
        if (name == null && tagId == null) {
            return drinkRepository.findAll(pageable);
        } else if (name == null) {
            return drinkRepository.findByTagId(tagId, pageable).orElse(null);
        } else if (tagId == null) {
            return drinkRepository.findByNameContains(name, pageable).orElse(null);
        } else {
            return drinkRepository.findByNameContainsAndTagId(name, tagId, pageable).orElse(null);
        }
    }

    public List<Drink> getDrinksReviewedByUser(Long userId) {
        List<DrinkReview> reviews = drinkReviewRepository.findByUser_UserId(userId);
        return reviews.stream()
                .map(DrinkReview::getDrink)
                .distinct()
                .collect(Collectors.toList());
    }
}
