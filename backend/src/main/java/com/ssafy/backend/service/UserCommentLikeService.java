package com.ssafy.backend.service;

import com.ssafy.backend.entity.UserCommentLike;
import com.ssafy.backend.repository.DrinkReviewRepository;
import com.ssafy.backend.repository.UserCommentLikeRepository;
import com.ssafy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserCommentLikeService {
    private final UserCommentLikeRepository userCommentLikeRepository;
    private final UserRepository userRepository;
    private final DrinkReviewRepository drinkReviewRepository;

    public void createUserLike(Long userId, Long reviewId) {
        userRepository.findById(userId).ifPresent(user -> {
            drinkReviewRepository.findById(reviewId).ifPresent(drinkReview -> {
                userCommentLikeRepository.findByUser_UserIdAndDrinkReview_DrinkReviewId(userId, reviewId).ifPresentOrElse(userCommentLikeRepository::delete, () -> {
                    userCommentLikeRepository.save(userCommentLikeRepository.save(userCommentLikeRepository.save(UserCommentLike.builder().user(user).drinkReview(drinkReview).build())));
                });
            });
        });
    }
}