package com.ssafy.backend.repository;

import com.ssafy.backend.entity.Drink;
import com.ssafy.backend.entity.DrinkReview;
import com.ssafy.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DrinkReviewRepository extends JpaRepository<DrinkReview, Long> {
    Page<DrinkReview> findByDrink(Drink drink, Pageable pageable);
    List<DrinkReview> findAllByUserAndDrink(User user, Drink drink);}

