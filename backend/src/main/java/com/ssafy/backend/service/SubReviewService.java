package com.ssafy.backend.service;

import com.ssafy.backend.dto.SubReviewDto;
import com.ssafy.backend.entity.DrinkReview;
import com.ssafy.backend.entity.SubReview;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.DrinkReviewRepository;
import com.ssafy.backend.repository.SubReviewRepository;
import com.ssafy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubReviewService {
    private final SubReviewRepository subReviewRepository;
    private final UserRepository userRepository;
    private final DrinkReviewRepository drinkReviewRepository;

    // 리뷰의 댓글을 조회하는 API
    public List<SubReview> getSubReviewList(Long reviewId) {
        if (!drinkReviewRepository.existsById(reviewId)) {
            throw new IllegalArgumentException("해당 리뷰가 존재하지 않습니다.");
        }
        return subReviewRepository.findAllByDrinkReview_DrinkReviewId(reviewId);
    }

    // 리뷰의 댓글을 작성하는 API
    public SubReview writeSubReview(SubReviewDto subReviewDto, Long userId) {
        DrinkReview drinkReview = drinkReviewRepository.findById(subReviewDto.getSubReviewId()).orElseThrow(() -> new IllegalArgumentException("해당 리뷰가 존재하지 않습니다."));
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("해당 유저가 존재하지 않습니다."));

        // content가 비어있는지 확인
        if (subReviewDto.getContent().isEmpty()) {
            throw new IllegalArgumentException("댓글 내용이 비어있습니다.");
        }

        SubReview subReview = SubReview.builder()
                .content(subReviewDto.getContent())
                .drinkReview(drinkReview)
                .user(user)
                .build();
        return subReviewRepository.save(subReview);
    }

    public void deleteSubReview(Long subReviewId, Long userId) {
        SubReview subReview = subReviewRepository.findById(subReviewId).orElseThrow(() -> new IllegalArgumentException("해당 댓글이 존재하지 않습니다."));
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("해당 유저가 존재하지 않습니다."));

        // 댓글 작성자와 삭제 요청자가 같은지 확인
        if (!subReview.getUser().equals(user)) {
            throw new IllegalArgumentException("댓글 작성자와 삭제 요청자가 다릅니다.");
        }

        subReviewRepository.delete(subReview);
    }

    public SubReview updateSubReview(SubReviewDto subReviewDto, Long userId) {
        SubReview subReview = subReviewRepository.findById(subReviewDto.getDrinkReviewId()).orElseThrow(() -> new IllegalArgumentException("해당 댓글이 존재하지 않습니다."));
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("해당 유저가 존재하지 않습니다."));

        // 댓글 작성자와 수정 요청자가 같은지 확인
        if (!subReview.getUser().equals(user)) {
            throw new IllegalArgumentException("댓글 작성자와 수정 요청자가 다릅니다.");
        }

        // content가 비어있는지 확인
        if (subReviewDto.getContent().isEmpty()) {
            throw new IllegalArgumentException("댓글 내용이 비어있습니다.");
        }

        subReview.update(subReviewDto.getContent());
        return subReviewRepository.save(subReview);
    }
}
