package com.ssafy.backend.repository;

import com.ssafy.backend.entity.ChatRoom;
import com.ssafy.backend.entity.Festival;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DrinkFestivalRepository  extends JpaRepository<Festival, Long> {
}
