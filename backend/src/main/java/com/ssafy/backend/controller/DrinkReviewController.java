package com.ssafy.backend.controller;

import com.ssafy.backend.dto.DrinkReviewDto;
import com.ssafy.backend.dto.DrinkReviewUpdateDto;
import com.ssafy.backend.service.DrinkReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

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

    @PostMapping("/guard")
    public ResponseEntity<?> createDrinkReview(HttpServletRequest request, @RequestBody DrinkReviewDto drinkReviewDto) {
        Long userId = (Long) request.getAttribute("userId");
        drinkReviewDto.setUserId(userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(drinkReviewService.createDrinkReview(drinkReviewDto));
    }

    @PutMapping("/guard/{drinkReviewId}")
    public ResponseEntity<?> updateDrinkReview(@PathVariable Long drinkReviewId, @RequestBody DrinkReviewUpdateDto drinkReviewUpdateDto, HttpServletRequest request) {
        return ResponseEntity.ok(drinkReviewService.updateDrinkReview(drinkReviewId, drinkReviewUpdateDto, (Long) request.getAttribute("userId")));
    }

    @DeleteMapping("/guard/{drinkReviewId}")
    public ResponseEntity<?> deleteDrinkReview(HttpServletRequest request, @PathVariable Long drinkReviewId) throws IllegalArgumentException {
        Long userId = (Long) request.getAttribute("userId");
        drinkReviewService.deleteDrinkReview(drinkReviewId, userId);
        return ResponseEntity.ok().build();
    }
}
