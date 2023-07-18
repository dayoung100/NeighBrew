package com.ssafy.backend.repository;

import com.ssafy.backend.entity.DrinkReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DrinkReviewRepository extends JpaRepository<DrinkReview, Long> {
    Optional<DrinkReview> findAllByDrink_DrinkId(Long drinkId);

    Optional<DrinkReview> findByDrinkReviewId(Long drinkReviewId);
}
