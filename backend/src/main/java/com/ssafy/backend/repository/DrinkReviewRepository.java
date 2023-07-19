package com.ssafy.backend.repository;

import com.ssafy.backend.entity.Drink;
import com.ssafy.backend.entity.DrinkReview;
import com.ssafy.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DrinkReviewRepository extends JpaRepository<DrinkReview, Long> {
    List<DrinkReview> findByDrink(Drink drink);
    List<DrinkReview> findAllByUserAndDrink(User user, Drink drink);}
