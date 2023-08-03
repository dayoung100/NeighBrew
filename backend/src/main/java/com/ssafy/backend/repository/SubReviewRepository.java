package com.ssafy.backend.repository;

import com.ssafy.backend.dto.SubReviewDto;
import com.ssafy.backend.entity.SubReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubReviewRepository extends JpaRepository<SubReview, Long> {
    List<SubReview> findAllByDrinkReview_DrinkReviewId(Long reviewId);
}
