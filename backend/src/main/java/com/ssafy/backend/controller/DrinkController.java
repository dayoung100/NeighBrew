package com.ssafy.backend.controller;

import com.ssafy.backend.dto.DrinkDto;
import com.ssafy.backend.dto.DrinkUpdateDto;
import com.ssafy.backend.entity.Drink;
import com.ssafy.backend.service.DrinkService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/drink")
public class DrinkController {
    private final DrinkService drinkService;

    // 모든 술 조회
    @GetMapping()
    public ResponseEntity<?> findAll(Pageable pageable) {
        return ResponseEntity.ok(drinkService.findAll(pageable));
    }

    // 술 이름과 태그로 검색
    @GetMapping("/search")
    public ResponseEntity<Page<Drink>> findDrinksByName(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Long tagId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        log.info("tagId: {}", tagId);
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<Drink> drinkPage = drinkService.findDrinkByName(name, tagId, pageRequest);


        return new ResponseEntity<>(drinkPage, HttpStatus.OK);
    }

    @GetMapping("/{drinkId}")
    public ResponseEntity<?> findDrinkById(@PathVariable Long drinkId) {
        return ResponseEntity.ok(drinkService.findById(drinkId));
    }

    //    유저가 리뷰를 작성한 술 정보 조회
    @GetMapping("/user/{userId}/review-drink")
    public ResponseEntity<List<Drink>> getDrinkReviewedByUser(@PathVariable Long userId) {
        List<Drink> drinks = drinkService.getDrinksReviewedByUser(userId);
        return ResponseEntity.ok(drinks);
    }


    // 술 추가
    @PostMapping()
    public ResponseEntity<?> save(@RequestBody DrinkDto drinkDto) throws IllegalArgumentException {
        return ResponseEntity.ok(drinkService.save(drinkDto.toEntity()));
    }

    // 술 삭제
    @DeleteMapping("/{drinkId}")
    public ResponseEntity<?> delete(@PathVariable Long drinkId) throws IllegalArgumentException {
        drinkService.delete(drinkId);
        // 삭제완료 메시지
        return ResponseEntity.ok("삭제 완료");
    }

    // 술 수정
    @PutMapping("/{drinkId}")
    public ResponseEntity<?> update(@PathVariable Long drinkId, @RequestBody DrinkUpdateDto drinkUpdateDto) throws IllegalArgumentException {
        log.info("drinkUpdateDto: {}", drinkUpdateDto);
        return ResponseEntity.ok(drinkService.updateDrink(drinkId, drinkUpdateDto));
    }
}
