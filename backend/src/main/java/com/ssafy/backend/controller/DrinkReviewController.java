package com.ssafy.backend.controller;

import com.ssafy.backend.dto.DrinkReviewDto;
import com.ssafy.backend.dto.DrinkReviewUpdateDto;
import com.ssafy.backend.service.DrinkReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/drinkreview")
@RequiredArgsConstructor
public class DrinkReviewController {
    private final DrinkReviewService drinkReviewService;

    @GetMapping("/{drinkId}")
    public ResponseEntity<?> getReviewsByDrinkId(@PathVariable Long drinkId, Pageable pageable) {
        return ResponseEntity.ok(drinkReviewService.getReviewsByDrinkId(drinkId, pageable));
    }

    @GetMapping("/{drinkId}/{userId}")
    public ResponseEntity<?> getReviewByUserIdAndDrinkId(@PathVariable Long drinkId, @PathVariable Long userId) {
        return ResponseEntity.ok(drinkReviewService.getReviewsByUserIdAndDrinkId(userId, drinkId));
    }

    @PostMapping("/guard")
    public ResponseEntity<?> createDrinkReview(HttpServletRequest request, @RequestBody DrinkReviewDto drinkReviewDto) {
        String userId = (String) request.getAttribute("userId");
        drinkReviewDto.setUserId(Long.valueOf(userId));
        return ResponseEntity.status(HttpStatus.CREATED).body(drinkReviewService.createDrinkReview(drinkReviewDto));
    }

    @PutMapping("/guard/{drinkReviewId}")
    public ResponseEntity<?> updateDrinkReview(@PathVariable Long drinkReviewId, @RequestBody DrinkReviewUpdateDto drinkReviewUpdateDto, HttpServletRequest request) {

        String userId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(drinkReviewService.updateDrinkReview(drinkReviewId, drinkReviewUpdateDto, Long.valueOf(userId)));
    }

    @DeleteMapping("/guard/{drinkReviewId}")
    public ResponseEntity<?> deleteDrinkReview(HttpServletRequest request, @PathVariable Long drinkReviewId) throws IllegalArgumentException {
        String userId = (String) request.getAttribute("userId");
        drinkReviewService.deleteDrinkReview(drinkReviewId, Long.valueOf(userId));
        return ResponseEntity.ok().build();
    }
}
