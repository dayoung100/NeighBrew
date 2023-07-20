package com.ssafy.backend.repository;

import com.ssafy.backend.entity.Drink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DrinkRepository extends JpaRepository<Drink, Long> {
    // 술 이름으로 조회 like 검색
    Optional<List<Drink>> findAllByNameContaining(String name);

    // 술 삭제
    Optional<Drink> deleteByDrinkId(Long drinkId);

    // 술 이름과 태그로 조회
    Optional<List<Drink>> findByNameContainingAndTagId(String name, Long tagId);

//    //내가 가진 술 조회
//    Optional<List<Drink>> findMyDrinkByUserId(Long userId);
}
