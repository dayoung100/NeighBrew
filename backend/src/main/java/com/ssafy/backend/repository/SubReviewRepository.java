package com.ssafy.backend.repository;

import com.ssafy.backend.entity.SubReview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubReviewRepository extends JpaRepository<SubReview, Long> {
    Page<SubReview> findAllByDrinkReview_DrinkReviewIdOrderByCreatedAtDesc(Long reviewId, Pageable pageable);
}
