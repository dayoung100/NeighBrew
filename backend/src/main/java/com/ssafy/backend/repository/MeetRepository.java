package com.ssafy.backend.repository;

import com.ssafy.backend.entity.Meet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MeetRepository extends JpaRepository<Meet, Long> {
    List<Meet> findByDrinkCategory(String drinkType);

    Meet findByMeetId(Long meetId);
}
