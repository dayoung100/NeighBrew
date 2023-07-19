package com.ssafy.backend.controller;

import com.ssafy.backend.dto.DrinkReviewDto;
import com.ssafy.backend.dto.DrinkReviewUpdateDto;
import com.ssafy.backend.service.DrinkReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/drinkreview")
@RequiredArgsConstructor
public class DrinkReviewController {
    private final DrinkReviewService drinkReviewService;

    @GetMapping("/{drinkId}")
    public ResponseEntity<?> getReviewsByDrinkId(@PathVariable Long drinkId) {
        return ResponseEntity.ok(drinkReviewService.getReviewsByDrinkId(drinkId));
    }

    @GetMapping("/{drinkId}/{userId}")
    public ResponseEntity<?> getReviewByUserIdAndDrinkId(@PathVariable Long drinkId, @PathVariable Long userId) {
        return ResponseEntity.ok(drinkReviewService.getReviewsByUserIdAndDrinkId(userId, drinkId));
    }

    @PostMapping()
    public ResponseEntity<?> createDrinkReview(@RequestBody DrinkReviewDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(drinkReviewService.createDrinkReview(request));
    }

    @PutMapping("/{drinkReviewId}")
    public ResponseEntity<?> updateDrinkReview(@PathVariable Long drinkReviewId, @RequestBody DrinkReviewUpdateDto request) {
        return ResponseEntity.ok(drinkReviewService.updateDrinkReview(drinkReviewId, request));
    }

    @DeleteMapping("/{drinkReviewId}")
    public ResponseEntity<?> deleteDrinkReview(@PathVariable Long drinkReviewId) throws IllegalArgumentException {
        try {
            drinkReviewService.deleteDrinkReview(drinkReviewId);
            return ResponseEntity.ok("삭제 완료");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
