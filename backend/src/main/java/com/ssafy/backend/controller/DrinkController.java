package com.ssafy.backend.controller;

import com.ssafy.backend.dto.DrinkDto;
import com.ssafy.backend.service.DrinkService;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/drink")
public class DrinkController {
    private final DrinkService drinkService;

    public DrinkController(DrinkService drinkService) {
        this.drinkService = drinkService;
    }

    // 모든 술 조회
    @GetMapping()
    public ResponseEntity<?> findAll(Pageable pageable) {
        return ResponseEntity.ok(drinkService.findAll(pageable));
    }

    // 술 이름과 태그로 조회
    @GetMapping("/")
    public ResponseEntity<?> findByNameAndTag(@RequestParam(required = false) String name, @RequestParam(required = false) Long tag, Pageable pageable) {
        return ResponseEntity.ok(drinkService.findByNameAndTag(name, tag, pageable));
    }


    // 술 추가
    @PostMapping()
    public ResponseEntity<?> save(@RequestBody DrinkDto drinkDto) throws IllegalArgumentException {
        System.out.println(drinkDto);

        try {
            return ResponseEntity.ok(drinkService.save(drinkDto.toEntity()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 술 삭제
    @DeleteMapping("/{drinkId}")
    public ResponseEntity<?> delete(@PathVariable Long drinkId) throws IllegalArgumentException {
        try {
            drinkService.delete(drinkId);
            // 삭제완료 메시지
            return ResponseEntity.ok("삭제 완료");

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 술 수정
    // 미완성
    @PatchMapping("/{drinkId}")
    public ResponseEntity<?> update(@PathVariable Long drinkId, @RequestBody DrinkDto drinkDto) throws IllegalArgumentException {
        try {
            return ResponseEntity.ok(drinkService.update(drinkId, drinkDto.toEntity()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
