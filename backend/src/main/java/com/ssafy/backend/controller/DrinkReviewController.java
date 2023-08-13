package com.ssafy.backend.controller;

import com.ssafy.backend.dto.drinkReview.DrinkReviewRequestDto;
import com.ssafy.backend.dto.drinkReview.DrinkReviewResponseDto;
import com.ssafy.backend.dto.drinkReview.DrinkReviewUpdateDto;
import com.ssafy.backend.service.DrinkReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/drinkreview")
public class DrinkReviewController {
    private final DrinkReviewService drinkReviewService;

    @GetMapping("/{drinkId}")
    public ResponseEntity<Page<DrinkReviewResponseDto>> getReviewsByDrinkId(@PathVariable Long drinkId, Pageable pageable) {
        return ResponseEntity.ok(drinkReviewService.getReviewsByDrinkId(drinkId, pageable));
    }

    // 리뷰 아이디로 리뷰 가져오기
    @GetMapping("/review/{drinkReviewId}")
    public ResponseEntity<DrinkReviewResponseDto> getReviewByDrinkReviewId(@PathVariable Long drinkReviewId) {
        return ResponseEntity.ok(drinkReviewService.getReviewByDrinkReviewId(drinkReviewId));
    }

    @GetMapping("/{drinkId}/{userId}")
    public ResponseEntity<List<DrinkReviewResponseDto>> getReviewByUserIdAndDrinkId(@PathVariable Long drinkId, @PathVariable Long userId) {
        return ResponseEntity.ok(drinkReviewService.getReviewsByUserIdAndDrinkId(userId, drinkId));
    }

    // 좋아요 많은 순으로 리뷰 가져오기
    @GetMapping("/likes")
    public ResponseEntity<Page<DrinkReviewResponseDto>> getReviewsOrderByLikes(Pageable pageable) {
        return ResponseEntity.ok(drinkReviewService.getReviewsOrderByLikes(pageable));
    }

    @PostMapping("")
    public ResponseEntity<DrinkReviewResponseDto> createDrinkReview(HttpServletRequest request,
                                                                    @ModelAttribute DrinkReviewRequestDto drinkReviewRequestDto,
                                                                    @RequestPart(value = "image", required = false) MultipartFile multipartFile) throws IOException {
        String userId = (String) request.getAttribute("userId");
        drinkReviewRequestDto.setUserId(Long.valueOf(userId));

        return ResponseEntity.ok().body(drinkReviewService.createDrinkReview(drinkReviewRequestDto, multipartFile));
    }

    @PutMapping("/{drinkReviewId}/{userId}")
    public ResponseEntity<DrinkReviewResponseDto> updateDrinkReview(@PathVariable Long drinkReviewId,
                                                                    @ModelAttribute DrinkReviewUpdateDto drinkReviewUpdateDto,
                                                                    @RequestPart(value = "image", required = false) Optional<MultipartFile> multipartFile,
                                                                    @PathVariable Long userId) throws IOException {
        return ResponseEntity.ok().body(drinkReviewService.updateDrinkReview(drinkReviewId, drinkReviewUpdateDto, multipartFile, Long.valueOf(userId)));
    }


    @DeleteMapping("/{drinkReviewId}")
    public ResponseEntity<String> deleteDrinkReview(HttpServletRequest request, @PathVariable Long drinkReviewId) throws IllegalArgumentException {
        String userId = (String) request.getAttribute("userId");
        drinkReviewService.deleteDrinkReview(drinkReviewId, Long.valueOf(userId));
        return ResponseEntity.ok("삭제 완료");
    }
}
