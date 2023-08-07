package com.ssafy.backend.controller;

import com.ssafy.backend.dto.DrinkReviewDto;
import com.ssafy.backend.dto.DrinkReviewUpdateDto;
import com.ssafy.backend.service.DrinkReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.MultipartConfigElement;
import javax.servlet.http.HttpServletRequest;
import java.util.Optional;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/drinkreview")
public class DrinkReviewController {
    private final DrinkReviewService drinkReviewService;

    @GetMapping("/{drinkId}")
    public ResponseEntity<?> getReviewsByDrinkId(@PathVariable Long drinkId, Pageable pageable) {
        return ResponseEntity.ok(drinkReviewService.getReviewsByDrinkId(drinkId, pageable));
    }

    // 리뷰 아이디로 리뷰 가져오기
    @GetMapping("/review/{drinkReviewId}")
    public ResponseEntity<?> getReviewByDrinkReviewId(@PathVariable Long drinkReviewId) {
        log.info("drinkReviewId: {}", drinkReviewId);
        return ResponseEntity.ok(drinkReviewService.getReviewByDrinkReviewId(drinkReviewId));
    }

    @GetMapping("/{drinkId}/{userId}")
    public ResponseEntity<?> getReviewByUserIdAndDrinkId(@PathVariable Long drinkId, @PathVariable Long userId) {
        return ResponseEntity.ok(drinkReviewService.getReviewsByUserIdAndDrinkId(userId, drinkId));
    }

    // 좋아요 많은 순으로 리뷰 가져오기
    @GetMapping("/likes")
    public ResponseEntity<?> getReviewsOrderByLikes(Pageable pageable) {
        return ResponseEntity.ok(drinkReviewService.getReviewsOrderByLikes(pageable));
    }

    @PostMapping("/guard")
    public ResponseEntity<?> createDrinkReview(Long userId,
                                               DrinkReviewDto drinkReviewDto,
                                               @RequestPart(value = "image", required = false)Optional<MultipartFile> multipartFile) {
        log.info("입력값 확인 : {}, {}, {}", userId, drinkReviewDto, multipartFile.get().getOriginalFilename());
        drinkReviewDto.setUserId(Long.valueOf(userId));
        try{
            if(multipartFile.isPresent())
                return ResponseEntity.status(HttpStatus.CREATED).body(drinkReviewService.createDrinkReview(drinkReviewDto, multipartFile.get()));
            else
                return ResponseEntity.status(HttpStatus.CREATED).body(drinkReviewService.createDrinkReview(drinkReviewDto, null));
        }catch(Exception e) {
            return ResponseEntity.badRequest().body("리뷰 작성 중 문제가 발생했습니다. \n" + e.getMessage());
        }

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
        return ResponseEntity.ok("삭제 완료");
    }
}
