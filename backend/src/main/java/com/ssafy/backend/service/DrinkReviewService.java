package com.ssafy.backend.service;

import com.ssafy.backend.dto.DrinkReviewDto;
import com.ssafy.backend.dto.DrinkReviewUpdateDto;
import com.ssafy.backend.entity.Drink;
import com.ssafy.backend.entity.DrinkReview;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.DrinkRepository;
import com.ssafy.backend.repository.DrinkReviewRepository;
import com.ssafy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DrinkReviewService {
    private final UserRepository userRepository;
    private final DrinkRepository drinkRepository;
    private final DrinkReviewRepository drinkReviewRepository;

    public DrinkReview createDrinkReview(DrinkReviewDto request) {
        Optional<User> user = userRepository.findById(request.getUserId());
        Optional<Drink> drink = drinkRepository.findById(request.getDrinkId());

        if (user.isPresent() && drink.isPresent()) {
            DrinkReview newDrinkReview = request.toEntity(user.get(), drink.get());
            return drinkReviewRepository.save(newDrinkReview);
        } else {
            throw new IllegalArgumentException("유저와 음료 중 존재하지 않는 정보가 있습니다.");
        }
    }

    public Page<DrinkReview> getReviewsByDrinkId(Long drinkId, Pageable pageable) {
        Optional<Drink> drink = drinkRepository.findById(drinkId);
        if (drink.isPresent()) {
            return drinkReviewRepository.findByDrink(drink.get(),pageable);
        } else {
            throw new IllegalArgumentException("음료가 존재하지 않습니다.");
        }
    }

    public List<DrinkReview> getReviewsByUserIdAndDrinkId(Long userId, Long drinkId) {
        Optional<User> user = userRepository.findById(userId);
        Optional<Drink> drink = drinkRepository.findById(drinkId);

        if (user.isPresent() && drink.isPresent()) {
            return drinkReviewRepository.findAllByUserAndDrink(user.get(), drink.get());
        } else {
            if (user.isEmpty()) {
                throw new IllegalArgumentException("해당 유저가 존재하지 않습니다.");
            } else {
                throw new IllegalArgumentException("해당 음료가 존재하지 않습니다.");
            }
        }
    }

    public void deleteDrinkReview(Long drinkReviewId, Long userId) {
        Optional<DrinkReview> drinkReview = drinkReviewRepository.findById(drinkReviewId);
        if (drinkReview.isPresent()) {
            if (!Objects.equals(drinkReview.get().getUser().getUserId(), userId)) {
                throw new IllegalArgumentException("해당 리뷰의 작성자가 아닙니다.");
            }
        } else {
            throw new IllegalArgumentException("음료 리뷰가 존재하지 않아 삭제할 수 없습니다.");
        }
        drinkReviewRepository.deleteById(drinkReviewId);
    }

    public DrinkReview updateDrinkReview(Long drinkReviewId, DrinkReviewUpdateDto request, Long userId) {
        Optional<DrinkReview> drinkReview = drinkReviewRepository.findById(drinkReviewId);

        // userId로 검증
        if (drinkReview.isPresent()) {
            if (!Objects.equals(drinkReview.get().getUser().getUserId(), userId)) {
                throw new IllegalArgumentException("해당 리뷰의 작성자가 아닙니다.");
            }
        } else {
            throw new IllegalArgumentException("음료 리뷰가 존재하지 않아 수정할 수 없습니다.");
        }

        DrinkReview updatedDrinkReview = drinkReview.get();
        updatedDrinkReview.setContent(request.getContent());
        return drinkReviewRepository.save(updatedDrinkReview);
    }
}
