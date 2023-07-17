package com.ssafy.backend.controller;

import com.ssafy.backend.dto.DrinkReviewDto;
import com.ssafy.backend.entity.Drink;
import com.ssafy.backend.service.DrinkReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/drinkreview")
public class DrinkReviewController {
    private DrinkReviewService drinkReviewService;

    public DrinkReviewController(DrinkReviewService drinkReviewService) {
        this.drinkReviewService = drinkReviewService;
    }

    @GetMapping()
    public ResponseEntity<?> getDrinkReview(Drink drink) {
        return ResponseEntity.ok().body(drinkReviewService.getDrinkReviews(drink));
    }

    @PostMapping()
    public ResponseEntity<?> registerDrinkReview(DrinkReviewDto drinkReviewDto) {
        return ResponseEntity.ok().body(drinkReviewService.registerDrinkReview(drinkReviewDto));
    }

    @DeleteMapping()
    public ResponseEntity<?> deleteDrinkReview(Long drinkReviewId) {
        return ResponseEntity.ok().body(drinkReviewService.deleteDrinkReview(drinkReviewId));
    }
    @PutMapping()
    public ResponseEntity<?> updateDrinkReview(DrinkReviewDto drinkReviewDto) {
        return ResponseEntity.ok().body(drinkReviewService.updateDrinkReview(drinkReviewDto));
    }

}
