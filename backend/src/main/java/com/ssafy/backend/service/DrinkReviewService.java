package com.ssafy.backend.service;

import com.ssafy.backend.dto.DrinkDto;
import com.ssafy.backend.dto.DrinkReviewDto;
import com.ssafy.backend.entity.DrinkReview;
import com.ssafy.backend.repository.DrinkReviewRepository;
import org.springframework.stereotype.Service;

@Service
public class DrinkReviewService {
    private final DrinkReviewRepository drinkReviewRepository;

    public DrinkReviewService(DrinkReviewRepository drinkReviewRepository) {
        this.drinkReviewRepository = drinkReviewRepository;
    }

    public Object getDrinkReviewsByDrinkId(DrinkDto drinkDto) {
        return drinkReviewRepository.findAllByDrink_DrinkId(drinkDto.getDrinkId()).orElse(null);
    }

    public void createDrinkReviewByUserIdAndDrinkId(DrinkReviewDto drinkReviewDto) {
        DrinkReview drinkReview = drinkReviewDto.toEntity();
        drinkReviewRepository.save(drinkReview);
    }

    public void deleteDrinkReviewByDrinkReviewId(Long drinkReviewId) {
        drinkReviewRepository.findByDrinkReviewId(drinkReviewId).ifPresentOrElse(drinkReviewRepository::delete,
                () -> {
                    throw new IllegalArgumentException("해당 리뷰가 존재하지 않습니다.");
                });
    }

    public void updateDrinkReviewByDrinkReviewId(Long drinkReviewId, DrinkReviewDto drinkReviewDto) {
        drinkReviewRepository.findByDrinkReviewId(drinkReviewId).ifPresentOrElse(drinkReview -> {
            drinkReview.update(drinkReviewDto);
            drinkReviewRepository.save(drinkReview);
        }, () -> {
            throw new IllegalArgumentException("해당 리뷰가 존재하지 않습니다.");
        });
    }
}
