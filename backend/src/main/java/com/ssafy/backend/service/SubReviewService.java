package com.ssafy.backend.service;

import com.ssafy.backend.entity.SubReview;
import com.ssafy.backend.repository.SubReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubReviewService {
    private final SubReviewRepository subReviewRepository;

    // 리뷰의 댓글을 조회하는 API
    public List<SubReview> getSubReviewList(Long reviewId) {
        return subReviewRepository.findAllByDrinkReview_DrinkReviewId(reviewId);
    }
}
