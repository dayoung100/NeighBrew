package com.ssafy.backend.controller;

import com.ssafy.backend.dto.DrinkDto;
import com.ssafy.backend.service.DrinkService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/drink")
public class DrinkController {
    private final DrinkService drinkService;

    public DrinkController(DrinkService drinkService) {
        this.drinkService = drinkService;
    }

    @PostMapping()
    public ResponseEntity<?> registDrink(DrinkDto drinkDto) {
        return new ResponseEntity<>(drinkService.registDrink(drinkDto), HttpStatus.CREATED);
    }

    @GetMapping()
    public ResponseEntity<?> getDrink(Long drinkId) {
        return new ResponseEntity<>(drinkService.getDrink(drinkId), HttpStatus.OK);
    }

    @GetMapping("/list")
    public ResponseEntity<?> getDrinkList() {
        return new ResponseEntity<>(drinkService.getDrinkList(), HttpStatus.OK);
    }

    @PutMapping()
    public ResponseEntity<?> updateDrink(DrinkDto drinkDto) {
        return new ResponseEntity<>(drinkService.updateDrink(drinkDto), HttpStatus.OK);
    }

    @DeleteMapping()
    public ResponseEntity<?> deleteDrink(Long drinkId) {
        drinkService.deleteDrink(drinkId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
