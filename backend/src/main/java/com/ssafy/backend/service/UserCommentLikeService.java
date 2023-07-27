package com.ssafy.backend.service;

import com.ssafy.backend.entity.DrinkReview;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.entity.UserCommentLike;
import com.ssafy.backend.repository.DrinkReviewRepository;
import com.ssafy.backend.repository.UserCommentLikeRepository;
import com.ssafy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserCommentLikeService {
    private final UserCommentLikeRepository userCommentLikeRepository;
    private final UserRepository userRepository;
    private final DrinkReviewRepository drinkReviewRepository;

    public boolean toggleUserLike(Long userId, Long reviewId) {
        User user = userRepository.findById(userId).orElse(null);
        DrinkReview drinkReview = drinkReviewRepository.findById(reviewId).orElse(null);

        if (user == null || drinkReview == null) {
            return false;
        }

        Optional<UserCommentLike> existingLike = userCommentLikeRepository.findByUser_UserIdAndDrinkReview_DrinkReviewId(userId, reviewId);

        if (existingLike.isPresent()) {
            // 좋아요 취소
            userCommentLikeRepository.delete(existingLike.get());
            return false;
        } else {
            // 좋아요 등록
            userCommentLikeRepository.save(UserCommentLike.builder().user(user).drinkReview(drinkReview).build());
            return true;
        }
    }
}