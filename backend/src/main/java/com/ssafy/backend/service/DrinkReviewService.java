package com.ssafy.backend.service;

import com.ssafy.backend.Enum.UploadType;
import com.ssafy.backend.dto.drinkReview.DrinkReviewRequestDto;
import com.ssafy.backend.dto.drinkReview.DrinkReviewResponseDto;
import com.ssafy.backend.dto.drinkReview.DrinkReviewUpdateDto;
import com.ssafy.backend.entity.Drink;
import com.ssafy.backend.entity.DrinkReview;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.DrinkRepository;
import com.ssafy.backend.repository.DrinkReviewRepository;
import com.ssafy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DrinkReviewService {
    private final UserRepository userRepository;
    private final DrinkRepository drinkRepository;
    private final DrinkReviewRepository drinkReviewRepository;

    private final S3Service s3Service;

    public DrinkReviewResponseDto createDrinkReview(DrinkReviewRequestDto drinkReviewRequestDto, MultipartFile multipartFile) throws IOException {

        String image = (multipartFile != null && !multipartFile.isEmpty())
                ? s3Service.upload(UploadType.DRINKREVIEW, multipartFile)
                : "no image";
        drinkReviewRequestDto.setImg(image);

        User user = userRepository.findById(drinkReviewRequestDto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("유저가 존재하지 않습니다."));
        Drink drink = drinkRepository.findById(drinkReviewRequestDto.getDrinkId())
                .orElseThrow(() -> new IllegalArgumentException("음료가 존재하지 않습니다."));

        DrinkReview drinkReview = drinkReviewRequestDto.toEntity(user, drink);
        drinkReviewRepository.save(drinkReview);

        return DrinkReviewResponseDto.fromEntity(drinkReview);
    }

    public Page<DrinkReviewResponseDto> getReviewsByDrinkId(Long drinkId, Pageable pageable) {
        Drink drink = drinkRepository.findById(drinkId).orElseThrow(() -> new IllegalArgumentException("음료가 존재하지 않습니다."));
        Page<DrinkReview> drinkReviewPage = drinkReviewRepository.findByDrink(drink, pageable);

        return drinkReviewPage.map(DrinkReviewResponseDto::fromEntity);
    }

    public List<DrinkReviewResponseDto> getReviewsByUserIdAndDrinkId(Long userId, Long drinkId) {
        User user = userRepository.findById(userId).orElseThrow(
                () -> new IllegalArgumentException("해당 유저가 존재하지 않습니다.")
        );
        Drink drink = drinkRepository.findById(drinkId).orElseThrow(
                () -> new IllegalArgumentException("해당 음료가 존재하지 않습니다.")
        );

        List<DrinkReview> drinkReviewList = drinkReviewRepository.findAllByUserAndDrink(user, drink);
        return drinkReviewList.stream().map(DrinkReviewResponseDto::fromEntity).collect(Collectors.toList());
    }

    public void deleteDrinkReview(Long drinkReviewId, Long userId) {
        DrinkReview drinkReview = drinkReviewRepository.findById(drinkReviewId)
                .orElseThrow(() -> new IllegalArgumentException("음료 리뷰가 존재하지 않아 삭제할 수 없습니다."));
        if (!Objects.equals(drinkReview.getUser().getUserId(), userId)) {
            throw new IllegalArgumentException("해당 리뷰의 작성자가 아닙니다.");
        }
        drinkReviewRepository.deleteById(drinkReviewId);
    }

    public DrinkReviewResponseDto updateDrinkReview(Long drinkReviewId, DrinkReviewUpdateDto request, Optional<MultipartFile> multipartFile, Long userId) throws IOException {
        if (!drinkReviewId.equals(request.getDrinkReviewId())) {
            throw new IllegalArgumentException("요청한 리뷰 ID와 전송된 데이터의 리뷰 ID가 일치하지 않습니다.");
        }

        DrinkReview drinkReview = drinkReviewRepository.findById(request.getDrinkReviewId())
                .orElseThrow(() -> new IllegalArgumentException("음료 리뷰가 존재하지 않아 수정할 수 없습니다."));

        if (!Objects.equals(drinkReview.getUser().getUserId(), userId)) {
            throw new IllegalArgumentException("해당 리뷰의 작성자가 아닙니다.");
        }

        if (multipartFile.isPresent()) {
            String uploadedImageUrl = s3Service.upload(UploadType.DRINKREVIEW, multipartFile.get());
            drinkReview.updateImg(uploadedImageUrl);
        }

        drinkReview.updateContent(request.getContent());

        drinkReviewRepository.save(drinkReview);
        return DrinkReviewResponseDto.fromEntity(drinkReview);
    }

    public List<DrinkReviewResponseDto> getReviewsOrderByLikes(Pageable pageable) {
        Page<DrinkReview> drinkReviewPage = drinkReviewRepository.findAllByOrderByLikeCountDesc(pageable);
        return drinkReviewPage.stream().map(DrinkReviewResponseDto::fromEntity).collect(Collectors.toList());
    }

    public DrinkReviewResponseDto getReviewByDrinkReviewId(Long drinkReviewId) {
        DrinkReview drinkReview = drinkReviewRepository.findByDrinkReviewId(drinkReviewId).orElseThrow(() -> new IllegalArgumentException("해당 리뷰가 존재하지 않습니다."));
        return DrinkReviewResponseDto.fromEntity(drinkReview);

    }
}
