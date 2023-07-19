package com.ssafy.backend.controller;

import com.ssafy.backend.dto.DrinkDto;
import com.ssafy.backend.dto.DrinkReviewDto;
import com.ssafy.backend.service.DrinkReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/drinkReview")
public class DrinkReviewController {
    private final DrinkReviewService drinkReviewService;

    public DrinkReviewController(DrinkReviewService drinkReviewService) {
        this.drinkReviewService = drinkReviewService;
    }

    @GetMapping()
    public ResponseEntity<?> getDrinkReviewsByDrinkId(DrinkDto drinkDto) {
        return ResponseEntity.ok(drinkReviewService.getDrinkReviewsByDrinkId(drinkDto));
    }

    /*
    아직 로그인 기능이 완성되지 않아서 userId를 받아오지 못하므로
    아직 유저검증 기능을 구현하지 못함
     */
    @PostMapping()
    public ResponseEntity<?> createDrinkReviewByUserId(DrinkReviewDto drinkReviewDto) {
        drinkReviewService.createDrinkReviewByUserIdAndDrinkId(drinkReviewDto);
        return ResponseEntity.ok(HttpStatus.CREATED);
    }

    /*
    아직 로그인 기능이 완성되지 않아서 userId를 받아오지 못하므로
    아직 유저검증 기능을 구현하지 못함
     */
    @DeleteMapping("/{drinkReviewId}")
    public ResponseEntity<?> deleteDrinkReviewByDrinkReviewId(@PathVariable Long drinkReviewId) {
        drinkReviewService.deleteDrinkReviewByDrinkReviewId(drinkReviewId);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    /*
    아직 로그인 기능이 완성되지 않아서 userId를 받아오지 못하므로
    아직 유저검증 기능을 구현하지 못함
     */
    @PutMapping("/{drinkReviewId}")
    public ResponseEntity<?> updateDrinkReviewByDrinkReviewId(@PathVariable Long drinkReviewId, @RequestBody DrinkReviewDto drinkReviewDto) {
        drinkReviewService.updateDrinkReviewByDrinkReviewId(drinkReviewId, drinkReviewDto);

        return ResponseEntity.ok(HttpStatus.OK);
    }
}
