package com.ssafy.backend.service;

import com.ssafy.backend.dto.DrinkReviewDto;
import com.ssafy.backend.entity.Drink;
import com.ssafy.backend.entity.DrinkReview;
import com.ssafy.backend.repository.DrinkReviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DrinkReviewService {
    private final DrinkReviewRepository drinkReviewRepository;

    public DrinkReviewService(DrinkReviewRepository drinkReviewRepository) {
        this.drinkReviewRepository = drinkReviewRepository;
    }

    public List<DrinkReview> getDrinkReviews(Drink drink) {

        return drinkReviewRepository.findAllByDrink_DrinkId(drink.getDrinkId()).orElse(null);
    }


    public DrinkReview registerDrinkReview(DrinkReviewDto drinkReviewDto) {
        DrinkReview drinkReview = new DrinkReview();
        drinkReview.setContent(drinkReviewDto.getContent());
        drinkReview.setImage(drinkReviewDto.getImage());
        drinkReview.setDrink(drinkReviewDto.getDrink());
        drinkReview.setUser(drinkReviewDto.getUser());
        return drinkReviewRepository.save(drinkReview);
    }

    public Object deleteDrinkReview(Long drinkReviewId) {
        drinkReviewRepository.deleteById(drinkReviewId);
        return null;
    }

    public Object updateDrinkReview(DrinkReviewDto drinkReviewDto) {
        DrinkReview drinkReview = drinkReviewRepository.findById(drinkReviewDto.getDrinkReviewId()).orElse(null);
        drinkReview.setContent(drinkReviewDto.getContent());
        drinkReview.setImage(drinkReviewDto.getImage());
        drinkReview.setDrink(drinkReviewDto.getDrink());
        drinkReview.setUser(drinkReviewDto.getUser());
        return drinkReviewRepository.save(drinkReview);
    }
}
