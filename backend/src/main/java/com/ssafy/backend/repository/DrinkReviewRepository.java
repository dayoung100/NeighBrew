package com.ssafy.backend.repository;

import com.ssafy.backend.entity.DrinkReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DrinkReviewRepository extends JpaRepository<DrinkReview, Long> {
    Optional<List<DrinkReview>> findAllByDrink_DrinkId(long drinkId);
}
