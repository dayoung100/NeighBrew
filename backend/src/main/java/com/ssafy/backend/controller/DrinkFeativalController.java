package com.ssafy.backend.controller;


import com.ssafy.backend.service.DrinkFestivalService;
import com.ssafy.backend.service.DrinkService;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/drinkFestival")
public class DrinkFeativalController {
    private final DrinkFestivalService drinkFestivalService;


    @GetMapping("/all")
    public ResponseEntity<?> getReviewsByDrinkId() {
        return ResponseEntity.ok(drinkFestivalService.getAllFestival());
    }

}
