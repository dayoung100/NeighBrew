package com.ssafy.backend.controller;

import com.ssafy.backend.dto.*;
import com.ssafy.backend.service.DrinkService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/drink")
public class DrinkController {
    private final DrinkService drinkService;

    // 모든 술 조회
    @GetMapping
    public ResponseEntity<Page<DrinkResponseDto>> findAllDrinks(Pageable pageable) {
        Page<DrinkResponseDto> drinks = drinkService.findAll(pageable);
        return ResponseEntity.ok(drinks);
    }

    // 술 이름과 태그로 검색
    @GetMapping("/search")
    public ResponseEntity<Page<DrinkResponseDto>> searchDrinksByCriteria(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Long tagId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<DrinkResponseDto> drinkPage = drinkService.searchDrinksByCriteria(name, tagId, pageRequest);


        return ResponseEntity.ok(drinkPage);
    }

    @GetMapping("/{drinkId}")
    public ResponseEntity<?> getDrinkDetailsById(@PathVariable Long drinkId) {
        DrinkResponseDto drinkResponseDto = drinkService.getDrinkDetailsById(drinkId);
        return ResponseEntity.ok(drinkResponseDto);
    }

    //    유저가 리뷰를 작성한 술 정보 조회
    @GetMapping("/user/{userId}/review-drink")
    public ResponseEntity<List<DrinkResponseDto>> findReviewedDrinksByUserId(@PathVariable Long userId) {
        List<DrinkResponseDto> drinkResponseDtos = drinkService.findReviewedDrinksByUserId(userId);
        return ResponseEntity.ok(drinkResponseDtos);
    }


    // 술 추가
    @PostMapping()
    public ResponseEntity<?> save(DrinkDto drinkDto,
                                  @RequestPart(value = "upload", required = false) Optional<MultipartFile> multipartFile) throws IllegalArgumentException, IOException {
        try{
            if(multipartFile.isPresent())
                return ResponseEntity.ok(drinkService.save(drinkDto, multipartFile.get()));
            else
                return ResponseEntity.ok(drinkService.save(drinkDto, null));
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.badRequest().body("실패");
        }


    }

    // 술 삭제
    @DeleteMapping("/{drinkId}")
    public ResponseEntity<String> deleteDrinkById(@PathVariable Long drinkId) {
        drinkService.deleteDrinkById(drinkId);
        // 삭제완료 메시지
        return ResponseEntity.ok("삭제 완료");
    }

    // 술 수정
    @PutMapping("/{drinkId}")
    public ResponseEntity<DrinkUpdateResponseDto> updateDrinkById(@PathVariable Long drinkId, @RequestBody DrinkUpdateRequestDto drinkUpdateRequestDto) {
        DrinkUpdateResponseDto updatedDrinkDto = drinkService.updateDrinkById(drinkId, drinkUpdateRequestDto);
        return ResponseEntity.ok(updatedDrinkDto);
    }

    //MD'S PICK 3개 랜덤으로 꺼내줌
    @GetMapping("/mdPick")
    public ResponseEntity<List<DrinkResponseDto>> getRandomMDPicks() throws IllegalArgumentException {
        return ResponseEntity.ok(drinkService.getRandomMDPicks());
    }
}
